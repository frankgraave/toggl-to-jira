<template>
  <section class="section">
    <div class="container">

      <div class="columns">
        <div class="column is-5">

          <h4 class="title">Account credentials</h4>

          <div class="field">
            <label class="label">Toggl API Key</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input" type="text" ref="togglApiKey" v-model="togglApiKey" placeholder="Toggl API Key">
              <span class="icon is-small is-left">
                <fa :icon="['fas', 'power-off']" />
              </span>
            </div>
          </div>

          <div class="field">
            <label class="label">Jira Auth method</label>
            <div class="field-body">
                <div class="field">
                  <div class="control">
                    <label class="radio">
                      <input id="jira-auth-basic" type="radio" value="Basic Auth" v-model="jiraAuthType">
                      Basic Auth
                    </label>
                    <label class="radio">
                      <input id="jira-auth-api" type="radio" value="API Key" v-model="jiraAuthType">
                      API Key
                    </label>
                  </div>
                </div>
              </div>
          </div>

          <template v-if="jiraAuthType === 'Basic Auth'">
            <div class="field">
              <label class="label">Jira username</label>
              <div class="control has-icons-left has-icons-right">
                <input class="input" type="text" ref="jiraName" v-model="jiraName" placeholder="Jira username">
                <span class="icon is-small is-left">
                  <fa :icon="['fab', 'jira']" />
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
          </template>

          <template v-else>
            <div class="field">
              <label class="label">Atlassian API Key</label>
              <div class="control has-icons-left has-icons-right">
                <input class="input" type="text" ref="atlassianApiKey" v-model="atlassianApiKey" placeholder="Atlassian ID API Key">
                <span class="icon is-small is-left">
                <fa :icon="['fab', 'atlassian']" />
              </span>
              </div>
            </div>
          </template>

          <div class="field is-grouped">
            <div class="control">
              <button id="saveAccountData" class="button is-dark" v-on:click="saveAccountData">Save</button>
            </div>
          </div>

        </div> <!-- End of first column -->

        <template v-if="togglApiKey === '' && (jiraName === '' && jiraPass === '' || atlassianApiKey === '')">
          <div class="column is-6">
            <article class="message is-dark">
              <div class="message-header">Note</div>
              <div class="message-body">
                Before using this, please make sure you've set both your credentials <strong>and</strong> API key(s) correctly. Also check out the Settings and make sure you adjust these to your needs. Happy logging!
              </div>
            </article>
          </div> <!-- End of second column -->
        </template>

      </div> <!-- End of all columns -->
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
        togglApiKey: store.get('toggl-api-key'),
        jiraName: store.get('jira-name'),
        jiraPass: store.get('jira-pass'),
        atlassianApiKey: store.get('atlassian-api-key'),
        jiraAuthType: store.get('jira-auth-type') ? store.get('jira-auth-type') : 'Basic Auth'
      }
    },
    methods: {
      saveAccountData () {
        document.getElementById('saveAccountData').classList.add('is-loading')
        document.getElementById('saveAccountData').classList.add('is-warning')

        store.set('toggl-api-key', this.$refs.togglApiKey.value)

        if (this.jiraAuthType === 'Basic Auth') {
          store.set('jira-name', this.$refs.jiraName.value)
          store.set('jira-pass', this.$refs.jiraPass.value)
        } else if (this.jiraAuthType === 'API Key') {
          store.set('atlassian-api-key', this.$refs.atlassianApiKey.value)
        }

        setTimeout(function () {
          document.getElementById('saveAccountData').classList.remove('is-loading')
          document.getElementById('saveAccountData').classList.remove('is-warning')
        }, 500)
      },
      clearInputs () {
        // When we delete credentials, update it visually.
        let inputs = document.getElementsByClassName('input')
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].value = ''
        }
      }
    },
    watch: {
      jiraAuthType (value) {
        store.set('jira-auth-type', value)
      }
    },
    mounted () {
      // When we receive the clearCredentials event that is
      // emitted from src/renderer/App.vue, we clear the data
      // as requested.
      this.$electron.ipcRenderer.on('clearCredentials', () => {
        document.getElementById('saveAccountData').setAttribute('disabled', true)
        // Only delete these, since we have other settings.
        store.set('toggl-api-key', '')
        store.set('jira-name', '')
        store.set('jira-pass', '')
        store.set('atlassian-api-key', '')
        this.clearInputs()
        document.getElementById('saveAccountData').removeAttribute('disabled')
      })
    }
  }
</script>

<style>
</style>
