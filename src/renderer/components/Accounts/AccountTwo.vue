<template>
  <div>
    <section class="hero is-light is-small">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Account <strong>Two</strong>
          </h1>
          <h2 class="subtitle">
            Set credentials for Account Two.
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">

        <div class="columns">
          <div class="column is-6">

            <div class="field">
              <label class="label">Account name</label>
              <div class="control has-icons-left">
                <input class="input" type="text" ref="accountTwoName" v-model="accountTwoName" placeholder="e.g. Open Social">
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
                    <input class="input" type="text" ref="accountTwoJiraUrl" v-model="accountTwoJiraUrl" placeholder="jira.website.com">
                  </p>
                </div>
              </div>
              <p class="help"><em>Simply add e.g. jira.website.com and you are good to go!</em></p>
            </div>

            <template v-if="!togglApiKey">
              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-dark" disabled>Save</button>
                  <button class="button is-dark is-outlined" disabled>Test authentication</button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="field is-grouped">
                <div class="control">
                  <button id="saveAccountData" class="button is-dark" v-on:click="saveAccountData">Save</button>
                  <button id="testAuthentication" class="button is-dark is-outlined" v-on:click="testAuthentication">Test authentication</button>
                </div>
              </div>
            </template>

          </div> <!-- End of first column -->

          <template v-if="!togglApiKey">
            <div class="column is-5">
              <div class="field">
                <label class="label">Jira username</label>
                <div class="control has-icons-left">
                  <input class="input" type="text" placeholder="Jira username" disabled>
                  <span class="icon is-small is-left">
                    <fa :icon="['fab', 'jira']" />
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Jira password</label>
                <div class="control has-icons-left">
                  <input class="input" type="password" placeholder="Jira password" disabled>
                  <span class="icon is-small is-left">
                    <fa :icon="['fas', 'key']" />
                  </span>
                </div>
              </div>

              <article class="message is-warning is-small">
                <div class="message-header">Note</div>
                <div class="message-body">
                  It looks like you haven't set up your Toggl API Key yet. Please configure it in the <router-link to="/settings">settings</router-link>.
                </div>
              </article>
            </div> <!-- End of second column -->
          </template>

          <template v-else>
            <div class="column is-5">
              <div class="field">
                <label class="label">Jira username</label>
                <div class="control has-icons-left">
                  <input class="input" type="text" ref="accountTwoJiraUsername" v-model="accountTwoJiraUsername" placeholder="Jira username">
                  <span class="icon is-small is-left">
                    <fa :icon="['fab', 'jira']" />
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Jira password</label>
                <div class="control has-icons-left">
                  <input class="input" type="password" ref="accountTwoJiraPassword" v-model="accountTwoJiraPassword" placeholder="Jira password">
                  <span class="icon is-small is-left">
                    <fa :icon="['fas', 'key']" />
                  </span>
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
            </div> <!-- End of second column -->
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
        accountTwoName: store.get('accountTwoName') ? store.get('accountTwoName') : '',
        accountTwoJiraUrl: store.get('accountTwoJiraUrl') ? store.get('accountTwoJiraUrl') : '',
        accountTwoJiraUsername: store.get('accountTwoJiraUsername') ? store.get('accountTwoJiraUsername') : '',
        accountTwoJiraPassword: store.get('accountTwoJiraPassword') ? store.get('accountTwoJiraPassword') : '',
        authSuccess: '',
        togglApiKey: store.get('togglApiKey') ? store.get('togglApiKey') : ''
      }
    },
    methods: {
      saveAccountData () {
        $('#spinner').fadeIn()
        document.getElementById('saveAccountData').setAttribute('disabled', true)

        store.set('accountTwoName', this.$refs.accountTwoName.value)
        store.set('accountTwoJiraUrl', this.$refs.accountTwoJiraUrl.value)
        store.set('accountTwoJiraUsername', this.$refs.accountTwoJiraUsername.value)
        store.set('accountTwoJiraPassword', this.$refs.accountTwoJiraPassword.value)

        setTimeout(function () {
          document.getElementById('saveAccountData').removeAttribute('disabled')
          $('#spinner').fadeOut()
        }, 500)
      },
      testAuthentication () {
        // Test the credentials to the url.
        $('#spinner').fadeIn()
        let auth = this
        this.authSuccess = 'Trying to authenticate...'
        axios.post('https://' + this.accountTwoJiraUrl + '/rest/auth/1/session',
          JSON.stringify({username: this.accountTwoJiraUsername, password: this.accountTwoJiraPassword}),
          {
            withCredentials: true,
            headers: {
              'Authorization': 'Basic ' + btoa(this.accountTwoJiraUsername + ':' + this.accountTwoJiraPassword),
              'Content-Type': 'application/json'
            }
          })
          .then(function (response) {
            $('#spinner').fadeOut()
            if (response.status === 200 && response.data.session.length !== '') {
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
