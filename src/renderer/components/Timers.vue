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
          You first have to set up your authentication <router-link to="/index">credentials</router-link> first!
        </div>
      </article>
    </template>
    <!--Show if we have no data-->
    <template v-else-if="untagged.length === 0 && statusMessage.length === 0">
      <article class="message is-success">
        <div class="message-header">No entries</div>
        <div class="message-body">
          If you expect entries, check your <router-link to="/settings">settings</router-link>. Otherwise, great job on logging all your hours!
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
                <td><span class="unknown-ticket"><strong>{{ value.ticket }}</strong></span></td>
              </template>
              <template v-else>
                <td>
                  <router-link to="#">
                    <span v-on:click="open(jiraUrl + '/browse/' + value.ticket)">
                      <fa icon="external-link-square-alt"></fa>
                    </span>
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
                  <span id="logEntry" class="button is-success is-small" v-on:click="logEntry(value)"><fa :icon="['fas', 'arrow-right']" /></span>
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
const Store = require('electron-store')
const store = new Store()
const axios = require('axios')
const JiraClient = require('jira-connector')

  let base64 = btoa(store.get('jira-name') + ':' + store.get('jira-pass'))

  let jira = new JiraClient({
    host: 'brixcrm.atlassian.net',
    basic_auth: {
      base64: base64
    }
  })

  export default {
    name: 'timers',
    data () {
      return {
        statusMessage: '',
        tagged: [],
        untagged: [],
        timeEntries: [],
        togglApiKey: store.get('toggl-api-key'),
        ignoreProjectKey: store.get('ignoreProjectKey'),
        loggedTag: store.get('loggedTag'),
        ignoreTag: store.get('ignoreTag'),
        jiraUrl: store.get('jiraUrl')
      }
    },
    mounted () {
      // Once the Timers.vue is mounted, get the data.
      this.getTogglData()
      // Each time the Timers.vue is mounted, there's an new listener
      // created. Therefore we need to remove all listeners first.
      this.$electron.ipcRenderer.removeAllListeners('getTogglTimeEntries')
      this.$electron.ipcRenderer.on('getTogglTimeEntries', () => {
        // Get the data on request.
        this.getTogglData()
      })
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      // Get the worklogs through the Toggl API.
      getTogglData: function () {
        // Show that we are trying to fetch the timers.
        $('#spinner').fadeIn()
        this.statusMessage = 'Loading your Toggl time entries...'
        let toggl = this
        if (this.togglApiKey !== '') {
          axios.get('https://www.toggl.com/api/v8/time_entries', {
            withCredentials: true,
            headers: {
              'Authorization': 'Basic ' + btoa(this.togglApiKey + ':api_token'),
              'Content-Type': 'application/json'
            }
          }).then(function (response) {
            // We've got our result, so we hide the statusMessage.
            $('#spinner').fadeOut()
            toggl.statusMessage = ''
            toggl.timeEntries = response.data.reverse()
            // Function to only get entries that met custom
            // criteria from Settings.vue.
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
      getIssue () {
        // Show spinner.
        $('#spinner').fadeIn()
        jira.issue.getIssue({
          issueKey: 'BEN-25745'
        }).then(function (response) {
          console.log(response)
          $('#spinner').fadeOut()
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
</script>

<style>
  table {
    table-layout: fixed;
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
    color: #00adb5;
  }
  span.unknown-ticket strong {
    color: #ff3860;
  }
  #ignoreEntry,
  #logEntry {
    margin-left: 10px;
  }
</style>
