<template>
  <div>
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
    <template v-else-if="togglEntriesData === null">
      <article class="message is-success">
        <div class="message-header">No entries</div>
        <div class="message-body">
          If you expect entries, check your <router-link to="/settings">settings</router-link>. Otherwise, great job on logging all your hours!
        </div>
      </article>
    </template>
    <!--Show default-->
    <template v-if="status !== ''">
      <article class="message is-success">
        <div class="message-header">Status</div>
        <div class="message-body">
          {{ status }}
        </div>
      </article>
    </template>
    <template v-else>
      <section class="section is-paddingless">
        <div class="table is-fullwidth is-striped">
          <thead>
          <tr>
            <th width="5%">Ticket</th>
            <th width="23%">Description</th>
            <th width="1%">Duration</th>
            <th width="2%">Date</th>
            <th width="9%">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <!-- When we do the for each here, make the ticket nr clickable? -->
            <td>OSSUPPORT-1928</td>
            <td>This is a description</td>
            <td>00:15:00</td>
            <td>5 Jan</td>
            <td>1</td>
          </tr>
          <tr>
            <td>OSSUPPORT-1928</td>
            <td>This is a description</td>
            <td>00:15:00</td>
            <td>5 Jan</td>
            <td>1</td>
          </tr>
          </tbody>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
  const Store = require('electron-store')
  const store = new Store()
  const axios = require('axios')

  export default {
    name: 'timers',
    data () {
      return {
        status: '',
        togglEntriesData: null,
        togglApiKey: store.get('toggl-api-key')
      }
    },
    mounted () {
    },
    methods: {
      // Get the worklogs through the Toggl API.
      getTogglData: function (e) {
        // Show that we are trying to fetch the timers.
        this.status = 'Getting all of your time entries...'
        if (this.togglApiKey !== '') {
          axios.get('https://www.toggl.com/api/v8/time_entries', {
            withCredentials: true,
            headers: {
              'Authorization': 'Basic ' + btoa(this.togglApiKey + ':api_token'),
              'Content-Type': 'application/json'
            }
          }).then(function (response) {
            // We've got our result, so we hide the status.
            this.status = ''
            this.timeEntries = response.data.reverse()
            // Function to only get entries that met custom
            // criteria from Settings.vue.
            this.setEntryProperties(this.timeEntries)
          }).catch(function (error) {
            this.status = 'Something went wrong, please try again later.'
            console.log('Error: ' + error)
          })
        } else {
          this.status = 'No API key.'
        }
      }
    }
  }
</script>
