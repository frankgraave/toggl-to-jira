<template>
  <div>
    <section class="hero is-light is-small">
      <div class="hero-body">
        <template v-if="accountName">
          <div class="container">
            <h1 class="title">
              {{ accountName }}
            </h1>
            <h2 class="subtitle">
              {{ accountName }}'s Jira URL and API Access Token.
            </h2>
          </div>
        </template>
        <template v-else>
          <div class="container">
            <h2 class="subtitle">
              Please provide your Jira URL and Atlassian API Access Token.
            </h2>
          </div>
        </template>
      </div>
    </section>

    <section class="section">
      <div class="container">

        <div class="columns">
          <div class="column is-6">

            <div class="field">
              <label class="label">Project or Company name</label>
              <div class="control has-icons-left">
                <input class="input" type="text" ref="accountName" v-model="accountName" placeholder="e.g. Apple">
                <span class="icon is-small is-left">
                  <fa :icon="['fas', 'folder']" />
                </span>
              </div>
            </div>

            <div class="field">
              <label class="label">Jira URL</label>
              <div class="field-body">
                <div class="field has-addons">
                  <p class="control">
                    <a class="button is-dark" disabled>
                      https://
                    </a>
                  </p>
                  <p class="control is-expanded">
                    <input class="input" type="text" ref="accountJiraUrl" v-model="accountJiraUrl" placeholder="e.g. jira.atlassian.net">
                  </p>
                </div>
              </div>
              <p class="help"><em>Simply add e.g. company.atlassian.net and you are good to go!</em></p>
            </div>

            <template v-if="!togglApiKey">
              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-dark" v-on:click="saveAccountData" disabled>Save</button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="field is-grouped">
                <div class="control">
                  <button id="saveAccountData" class="button is-dark" v-on:click="saveAccountData">Save</button>
                </div>
              </div>
            </template>

          </div> <!-- End of first (left) column -->

          <template v-if="!togglApiKey">
            <div class="column is-5">
              <div class="field">
                <label class="label">Atlassian account email</label>
                <div class="control has-icons-left">
                  <input class="input" type="text" ref="accountEmail" v-model="accountEmail" disabled>
                  <span class="icon is-small is-left">
                    <fa :icon="['fas', 'envelope-square']" />
                  </span>
                </div>
                <p class="help"><em>Your email address which is used for your Jira account.</em></p>
              </div>
              <div class="field">
                <label class="label">Atlassian API access token</label>
                <div class="control has-icons-left">
                  <input class="input" type="text" ref="accountAccessToken" v-model="accountAccessToken" disabled>
                  <span class="icon is-small is-left">
                    <fa :icon="['fab', 'atlassian']" />
                  </span>
                </div>
                <p class="help"><em>If you don't have this, simply generate one at https://id.atlassian.com/manage/api-tokens.</em></p>
              </div>

              <article class="message is-warning is-small">
                <div class="message-header">Note</div>
                <div class="message-body">
                  It looks like you haven't set up your Toggl API Key yet. Please configure it in the <router-link to="/settings">settings</router-link>.
                </div>
              </article>
            </div> <!-- End of second (right) column -->
          </template>

          <template v-else>
            <div class="column is-5">
              <div class="field">
                <label class="label">Atlassian account email</label>
                <div class="control has-icons-left">
                  <input class="input" type="text" ref="accountEmail" v-model="accountEmail">
                  <span class="icon is-small is-left">
                    <fa :icon="['fas', 'envelope-square']" />
                  </span>
                </div>
                <p class="help"><em>Your email address which is used for your Jira account.</em></p>
              </div>
              <div class="field">
                <label class="label">Atlassian API access token</label>
                <div class="control has-icons-left">
                  <input class="input" type="password" ref="accountAccessToken" v-model="accountAccessToken">
                  <span class="icon is-small is-left">
                    <fa :icon="['fab', 'atlassian']" />
                  </span>
                </div>
                <p class="help"><em>You can generate one at https://id.atlassian.com/manage/api-tokens.</em></p>
              </div>

              <div class="field is-grouped">
                <div class="control">
                  <button id="testAuthentication" class="button is-dark is-outlined" v-on:click="testAuthentication">Test authentication</button>
                </div>
              </div>

              <template v-if="authSuccess === 'Trying to authenticate...'">
                <article class="message is-info is-small">
                  <div class="message-header">Note</div>
                  <div class="message-body">
                    {{ authSuccess }}
                  </div>
                </article>
              </template>
              <template v-if="authSuccess === 'Successfully authenticated!'">
                <article class="message is-success is-small">
                  <div class="message-header">Note</div>
                  <div class="message-body">
                    {{ authSuccess }}
                  </div>
                </article>
              </template>
              <template v-if="authSuccess === 'Authentication failed...'">
                <article class="message is-danger is-small">
                  <div class="message-header">Note</div>
                  <div class="message-body">
                    {{ authSuccess }}
                  </div>
                </article>
              </template>
            </div> <!-- End of second (right) column -->
          </template>


        </div> <!-- End of all columns -->
      </div>
    </section>
  </div>
</template>

<script>
  import $ from 'jquery'

  const Store = require('electron-store')
  const store = new Store()
  const axios = require('axios')

  export default {
    name: 'account-one',
    data () {
      return {
        accountName: store.get('accountName') ? store.get('accountName') : '',
        accountEmail: store.get('accountEmail') ? store.get('accountEmail') : '',
        accountJiraUrl: store.get('accountJiraUrl') ? store.get('accountJiraUrl') : '',
        accountAccessToken: store.get('accountAccessToken') ? store.get('accountAccessToken') : '',
        authSuccess: '',
        togglApiKey: store.get('togglApiKey') ? store.get('togglApiKey') : '',
        projectBaseUrl: store.get('projectBaseUrl') ? store.get('projectBaseUrl') : '',
        basicAuthToken: store.get('basicAuthToken') ? store.get('basicAuthToken') : ''
      }
    },
    methods: {
      saveAccountData () {
        $('#spinner').fadeIn()
        document.getElementById('saveAccountData').setAttribute('disabled', true)

        store.set('accountName', this.$refs.accountName.value)
        store.set('accountEmail', this.$refs.accountEmail.value)
        store.set('accountJiraUrl', this.$refs.accountJiraUrl.value)
        store.set('accountAccessToken', this.$refs.accountAccessToken.value)
        store.set('basicAuthToken', 'Basic ' + btoa(this.$refs.accountEmail.value + ':' + this.$refs.accountAccessToken.value))
        store.set('projectBaseUrl', 'https://' + this.$refs.accountJiraUrl.value)

        setTimeout(function () {
          document.getElementById('saveAccountData').removeAttribute('disabled')
          $('#spinner').fadeOut()
        }, 500)
      },
      testAuthentication () {
        // Test the credentials to the url.
        $('#spinner').fadeIn()
        let auth = this
        let projectBaseUrl = 'https://' + this.accountJiraUrl + '/rest/api/2/serverInfo'
        let basicAuthToken = btoa(this.accountEmail + ':' + this.accountAccessToken)
        let headers = {
          'Authorization': 'Basic ' + basicAuthToken,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }

        this.authSuccess = 'Trying to authenticate...'
        axios.get(projectBaseUrl, {headers}
        )
          .then(function (response) {
            $('#spinner').fadeOut()
            if (response.status === 200) {
              auth.authSuccess = 'Successfully authenticated!'
              auth.removeAuthNote()
            } else {
              auth.authSuccess = 'Authentication failed...'
              auth.removeAuthNote()
            }
          })
          .catch(function (error) {
            $('#spinner').fadeOut()
            auth.authSuccess = 'Authentication failed...'
            auth.removeAuthNote()
            console.log('Error: ' + error)
          })
      },
      removeAuthNote () {
        let auth = this
        setInterval(function () {
          auth.authSuccess = ''
        }, 3500)
      }
    }
  }
</script>

<style>
</style>
