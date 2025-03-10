<template>
  <div>
    <template v-if="statusMessage !== ''">
      <article class="message is-info">
        <div class="message-header">Status</div>
        <div class="message-body">
          {{ statusMessage }}
        </div>
      </article>
    </template>
    <!--If the user has not set up their Toggl API Key-->
    <template v-if="togglApiKey === ''">
      <article class="message is-warning">
        <div class="message-header">Uh-oh!</div>
        <div class="message-body">
          You first have to set up your <router-link to="/settings">Toggl API Key</router-link> first!
        </div>
      </article>
    </template>
    <!--Show default-->
    <template v-else>
      <section class="section is-paddingless">
        <table class="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th width="10%">Ticket</th>
              <th width="19%">Description</th>
              <th width="5%">Duration</th>
              <th width="4%">Date</th>
              <th width="8%">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="value in untagged">
              <!--If there's an unknown ticket, show this to the user-->
              <template v-if="value.ticket === 'Unknown Ticket!'">
                <td>
                  <fa icon="exclamation-triangle"></fa>
                  <span class="unknown-ticket"><strong>{{ value.ticket }}</strong></span>
                </td>
              </template>
              <template v-else>
                <td>
                  <router-link to="#">
                    <template v-if="activeAccount === 'accountOne'">
                      <span v-on:click="open(accountOneJiraUrl + '/browse/' + value.ticket)">
                        <fa icon="external-link-square-alt"></fa>
                      </span>
                    </template>
                    <template v-if="activeAccount === 'accountTwo'">
                      <span v-on:click="open(accountTwoJiraUrl + '/browse/' + value.ticket)">
                        <fa icon="external-link-square-alt"></fa>
                      </span>
                    </template>
                  </router-link>&nbsp;
                  {{ value.ticket }}
                </td>
              </template>

              <td>{{ value.description }}</td>
              <td>{{ $timeTo.fromS(value.duration, 'hh:mm:ss') }}</td>
              <td>{{ $dateFns.format(value.start, 'D MMM') }}</td>
              <td>
                <!--If there's an unknown ticket, provide the ignore option-->
                <template v-if="value.ticket !== 'Unknown Ticket!'">
                  <span id="logEntry" class="button is-primary is-small" v-on:click="logEntry(value)"><fa :icon="['fas', 'arrow-right']" /></span>
                </template>
                <template v-else>
                  <span id="ignoreEntry" class="button is-warning is-small" v-on:click="ignoreEntry(value)"><fa :icon="['fas', 'archive']" /></span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<script>
  import $ from 'jquery'
  import dateFns from 'date-fns'

  const Store = require('electron-store')
  const store = new Store()
  const axios = require('axios')

  export default {
    name: 'timers',
    data () {
      return {
        statusMessage: '',
        tagged: [],
        untagged: [],
        timeEntries: [],
        togglApiKey: store.get('togglApiKey'),
        ignoreProjectKey: store.get('ignoreProjectKey'),
        loggedTag: store.get('loggedTag'),
        ignoreTag: store.get('ignoreTag'),
        activeAccount: store.get('activeAccount') ? store.get('activeAccount') : '',
        accountOneJiraUrl: store.get('accountOneJiraUrl') ? store.get('accountOneJiraUrl') : '',
        accountTwoJiraUrl: store.get('accountTwoJiraUrl') ? store.get('accountTwoJiraUrl') : '',
        rojectBaseUrl: store.get('projectBaseUrl') ? store.get('projectBaseUrl') : '',
        basicAuthToken: store.get('basicAuthToken') ? store.get('basicAuthToken') : '',
        accountName: store.get('accountName') ? store.get('accountName') : '',
        accountEmail: store.get('accountEmail') ? store.get('accountEmail') : '',
        accountJiraUrl: store.get('accountJiraUrl') ? store.get('accountJiraUrl') : '',
        accountAccessToken: store.get('accountAccessToken') ? store.get('accountAccessToken') : ''
      }
    },
    mounted () {
      // TODO: Set interval on fetching data?! (with setting for every 5m/10m/15m)
      // Once the Timers.vue is mounted, get the data.
      this.untagged = []
      this.getTogglData()
      // Each time the Timers.vue is mounted, there's an new listener
      // created. Therefore we need to remove all listeners first.
      this.$electron.ipcRenderer.removeAllListeners('getTogglTimeEntries')
      this.$electron.ipcRenderer.on('getTogglTimeEntries', () => {
        // Get the data on request.
        this.untagged = []
        this.getTogglData()
      })
    },
    methods: {
      // Opens an external url.
      open (link) {
        this.$electron.shell.openExternal('https://' + link)
      },
      // Get the worklogs through the Toggl API.
      getTogglData: function () {
        let toggl = this
        if (this.togglApiKey) {
          $('#spinner').fadeIn()
          axios.get('https://www.toggl.com/api/v8/time_entries', {
            withCredentials: true,
            headers: {
              'Authorization': 'Basic ' + btoa(this.togglApiKey + ':api_token'),
              'Content-Type': 'application/json'
            }
          }).then(function (response) {
            $('#spinner').fadeOut()
            toggl.timeEntries = response.data.reverse()
            toggl.setEntryProperties(toggl.timeEntries)
          }).catch(function (error) {
            toggl.statusMessage = 'Something went wrong :('
            console.log('Error: ' + error)
            $('#spinner').fadeOut()
          })
        }
      },
      // Manipulate the data and only get what we need store it in
      // a new array so we can populate our table with those entries.
      setEntryProperties: function (data) {
        // For global vars.
        let togglTimers = this
        // Go through the data.
        for (const entries in data) {
          // Store each timer.
          let entry = data[entries]
          // Skip running timers.
          if (entry['duration'] < 0) {
            continue
          }
          // Check for a match on the ticket.
          let match = entry.description.match('([A-Z]{1,}-[0-9]{1,})')
          // New iteration.
          if (match && (this.ignoreProjectKey === '' || match[0].indexOf(this.ignoreProjectKey) === -1)) {
            if (entry.hasOwnProperty('tags') && Object.values(entry.tags).includes(this.loggedTag)) {
              togglTimers.tagged.push(entry)
            } else {
              // Add ticket number we matched.
              entry['ticket'] = match[0]
              entry['originalDescription'] = entry['description']
              // Manipulate the description.
              let desc = entry['description'].replace(match[0], '')
              desc = desc.replace(/- /, '')
              entry['description'] = desc
              togglTimers.untagged.push(entry)
            }
          // If we can't match the ticket, check if it should be ignored.
          } else if (!match) {
            if (entry.hasOwnProperty('tags') && Object.values(entry.tags).includes(this.ignoreTag)) {
              togglTimers.tagged.push(entry)
            // No match? Don't ignore? Then it's an UFO ticket.
            } else {
              // No ticket number found.
              entry['ticket'] = 'Unknown Ticket!'
              entry['description'] = entry['description']
              togglTimers.untagged.push(entry)
            }
          }
        }
      },
      // This logs an entry to the corresponding ticket.
      logEntry: function (value) {
        let logEntry = this
        // Get values from ticket.
        let ticket = value.ticket
        let description = value.description
        let started = dateFns.format(value.start, 'YYYY-MM-DDTHH:mm:ss.SSSZZ')
        // Jira can only handle worklogs of a minute or more.
        let duration = value.duration >= 60 ? value.duration : 60
        // Prepare credentials.
        let basicAuthToken = btoa(this.accountEmail + ':' + this.accountAccessToken)
        let headers = {
          'Authorization': 'Basic ' + basicAuthToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }

        // Update button visuals.
        document.getElementById('logEntry').setAttribute('disabled', true)
        document.getElementById('logEntry').classList.remove('is-success')
        document.getElementById('logEntry').classList.add('is-loading')
        document.getElementById('logEntry').classList.add('is-warning')
        // Prepare the JSON data.
        let data = JSON.stringify({
          'comment': description,
          'started': started,
          'timeSpentSeconds': duration,
          'adjustEstimate': 'new',
          'newEstimate': '0h'
        })
        // Post it to the endpoint.
        axios.post('https://' + logEntry.getUrl(this.accountJiraUrl) + '/rest/api/2/issue/' + ticket + '/worklog', data, {headers}
        )
          .then(function (response) {
            console.log(response)
            if (response.status === 201) {
              // Our ticket has been updated, update Toggl
              // with the loggedTag.
              logEntry.updateTogglTimeEntry(value)
            }
          })
          .catch(function (error) {
            console.log('Error: ' + error)
          })
      },
      getUrl (activeAccount) {
        let url = this.accountJiraUrl
        // @todo: fix this method once we can create more accounts.
        return url
      },
      updateTogglTimeEntry: function (entry) {
        var togglTimers = this
        // Add the label so we know its now logged.
        if (entry['tags'] === undefined) {
          entry['tags'] = [this.loggedTag]
        } else {
          entry['tags'].push(this.loggedTag)
        }
        // Prepare the JSON.
        let timeEntry = JSON.stringify({
          'time_entry': {
            'description': entry['originalDescription'],
            'tags': entry['tags'],
            'duration': entry['duration'],
            'start': entry['start'],
            'stop': entry['stop'],
            'duronly': entry['duronly'],
            'pid': entry['pid'],
            'billable': entry['billable']
          }
        })
        // Update the ticket.
        axios.put('https://www.toggl.com/api/v8/time_entries/' + entry.id, timeEntry, {
          headers: {
            'Authorization': 'Basic ' + btoa(this.togglApiKey + ':api_token'),
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          console.log(response)
          if (response.status === 200) {
            // Update button visuals.
            document.getElementById('logEntry').classList.add('is-success')
            document.getElementById('logEntry').classList.remove('is-loading')
            document.getElementById('logEntry').classList.remove('is-warning')
            document.getElementById('logEntry').removeAttribute('disabled')
            // Remove the entry since we successfully logged it.
            let index = togglTimers.untagged.indexOf(entry)
            if (index > -1) {
              togglTimers.untagged.splice(index, 1)
            }
          }
        }).catch(function (error) {
          console.log('Error: ' + error)
        })
      },
      ignoreEntry: function (entry) {
        let togglTimers = this

        // Update button visuals.
        $('#spinner').fadeIn()
        document.getElementById('ignoreEntry').setAttribute('disabled', true)
        document.getElementById('ignoreEntry').classList.add('is-loading')

        // Add the label so we know its now logged.
        if (entry['tags'] === undefined) {
          entry['tags'] = [this.ignoreTag]
        } else {
          entry['tags'].push(this.ignoreTag)
        }
        // Prepare the JSON.
        let timeEntry = JSON.stringify({
          'time_entry': {
            'description': entry['originalDescription'],
            'tags': entry['tags'],
            'duration': entry['duration'],
            'start': entry['start'],
            'stop': entry['stop'],
            'duronly': entry['duronly'],
            'pid': entry['pid'],
            'billable': entry['billable']
          }
        })
        // Update the ticket.
        axios.put('https://www.toggl.com/api/v8/time_entries/' + entry.id, timeEntry, {
          headers: {
            'Authorization': 'Basic ' + btoa(this.togglApiKey + ':api_token'),
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          console.log(response)
          if (response.status === 200) {
            // Update button visuals.
            $('#spinner').fadeOut()
            document.getElementById('ignoreEntry').classList.remove('is-loading')
            document.getElementById('ignoreEntry').classList.remove('is-warning')
            document.getElementById('ignoreEntry').removeAttribute('disabled')
            // Remove the entry since we successfully logged it.
            let index = togglTimers.untagged.indexOf(entry)
            if (index > -1) {
              togglTimers.untagged.splice(index, 1)
            }
          }
        }).catch(function (error) {
          $('#spinner').fadeOut()
          console.log('Error: ' + error)
        })
      }
    }
  }
</script>

<style>
  table {
    table-layout: fixed;
    box-shadow: 0 8px 16px rgba(15, 15, 15, 0.1);
  }
  td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .table td {
    font-size: 16px;
    vertical-align: middle !important;
  }
  .table td a {
    color: #999999;
  }
  .table td a:hover {
    color: #68d2b0;
  }
  span.unknown-ticket strong {
    color: #ff3860;
  }
  #ignoreEntry,
  #logEntry {
    margin-left: 10px;
  }
</style>
