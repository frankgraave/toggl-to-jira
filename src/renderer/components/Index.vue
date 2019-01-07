<template>
  <section class="section">
    <div class="container">

      <div class="columns">
        <div class="column is-5">

          <h4 class="title">Account credentials</h4>

          <div class="field">
            <label class="label">Jira username</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input" type="text" ref="jiraName" v-model="jiraName" placeholder="Jira username">
              <span class="icon is-small is-left">
                <fa :icon="['fas', 'clock']" />
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Jira password</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input" type="password" ref="jiraPass" v-model="jiraPass" placeholder="Jira password">
              <span class="icon is-small is-left">
                <fa :icon="['fas', 'key']" />
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Toggl API Key</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input" type="text" ref="togglApiKey" v-model="togglApiKey" placeholder="Toggl API Key">
              <span class="icon is-small is-left">
                <fa :icon="['fas', 'power-off']" />
              </span>
            </div>
          </div>

          <div class="field is-grouped">
            <div class="control">
              <button id="saveAccountData" class="button is-dark" v-on:click="saveAccountData">Save</button>
            </div>
          </div>

        </div> <!-- End of first column -->

        <template v-if="jiraPass === '' || togglApiKey === ''">
          <div class="column is-6">
            <article class="message is-dark is-small">
              <div class="message-header">
                Note
              </div>
              <div class="message-body">
                Before using this, please make sure you've set both your credentials <strong>and</strong> API key correctly. Also check out the Settings and make sure you adjust these to your needs. Happy logging!
              </div>
            </article>
          </div> <!-- End of second column -->
        </template>

      </div> <!-- End of columns -->
    </div>
  </section>
</template>

<script>
  const Store = require('electron-store')
  const store = new Store()

  export default {
    name: 'index',
    data () {
      return {
        jiraName: store.get('jira-name'),
        jiraPass: store.get('jira-pass'),
        togglApiKey: store.get('toggl-api-key')
      }
    },
    methods: {
      saveAccountData () {
        document.getElementById('saveAccountData').classList.add('is-loading')
        document.getElementById('saveAccountData').classList.add('is-warning')

        store.set('jira-name', this.$refs.jiraName.value)
        store.set('jira-pass', this.$refs.jiraPass.value)
        store.set('toggl-api-key', this.$refs.togglApiKey.value)

        setTimeout(function () {
          document.getElementById('saveAccountData').classList.remove('is-loading')
          document.getElementById('saveAccountData').classList.remove('is-warning')
        }, 500)
      }
    },
    mounted () {
      // When we receive the clearCredentials event that is
      // emitted from src/renderer/App.vue, we clear the data
      // as requested.
      this.$electron.ipcRenderer.on('clearCredentials', () => {
        document.getElementById('saveAccountData').setAttribute('disabled', true)
        // Only delete these, since we have other settings.
        store.delete('jira-name')
        store.delete('jira-pass')
        store.delete('toggl-api-key')
        // Update it visually
        this.$refs.jiraName.value = ''
        this.$refs.jiraPass.value = ''
        this.$refs.togglApiKey.value = ''
        document.getElementById('saveAccountData').removeAttribute('disabled')
      })
    }
  }
</script>

<style>
</style>
