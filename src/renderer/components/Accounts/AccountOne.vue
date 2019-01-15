<template>
    <div>
        <section class="hero is-light is-small">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Account <strong>One</strong>
                    </h1>
                    <h2 class="subtitle">
                        Set credentials for Account One.
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
                                <input class="input" type="text" ref="accountOneName" v-model="accountOneName" placeholder="e.g. Open Social">
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
                                        <a class="button is-static">
                                            https://
                                        </a>
                                    </p>
                                    <p class="control is-expanded">
                                        <input class="input" type="text" ref="jiraUrlOne" v-model="jiraUrlOne" placeholder="jira.website.com">
                                    </p>
                                </div>
                            </div>
                            <p class="help"><em>Simply add e.g. jira.website.com and you are good to go!</em></p>
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
                                    <input class="input" type="text" ref="jiraName" v-model="jiraName" placeholder="Jira username">
                                    <span class="icon is-small is-left">
                                  <fa :icon="['fab', 'jira']" />
                                </span>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Jira password</label>
                                <div class="control has-icons-left">
                                    <input class="input" type="password" ref="jiraPass" v-model="jiraPass" placeholder="Jira password">
                                    <span class="icon is-small is-left">
                                  <fa :icon="['fas', 'key']" />
                                </span>
                                </div>
                            </div>
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

  export default {
    name: 'account-one',
    data () {
      return {
        accountOneName: store.get('accountOneName') ? store.get('accountOneName') : '',
        jiraUrlOne: store.get('jiraUrlOne') ? store.get('jiraUrlOne') : '',
        jiraName: store.get('jiraName') ? store.get('jiraName') : '',
        jiraPass: store.get('jiraPass') ? store.get('jiraPass') : '',
        togglApiKey: store.get('togglApiKey') ? store.get('togglApiKey') : ''
      }
    },
    mounted () {
      // Each time the Index.vue is mounted, there's an new listener
      // created. Therefore we need to remove all listeners first.
      this.$electron.ipcRenderer.removeAllListeners('clearAllCredentials')
      this.$electron.ipcRenderer.once('clearAllCredentials', () => {
        $('#spinner').fadeIn()
        document.getElementById('saveAccountData').setAttribute('disabled', true)
        // Only delete these, since we have other settings.
        store.get('accountOneName', '')
        store.get('jiraUrlOne', '')
        store.set('jiraName', '')
        store.set('jiraPass', '')
        store.set('togglApiKey', '')
        this.clearInputs()
        setTimeout(function () {
          document.getElementById('saveAccountData').removeAttribute('disabled')
          $('#spinner').fadeOut()
        }, 500)
      })
    },
    methods: {
      saveAccountData () {
        $('#spinner').fadeIn()
        document.getElementById('saveAccountData').setAttribute('disabled', true)

        store.set('accountOneName', this.$refs.accountOneName.value)
        store.set('jiraUrlOne', this.$refs.jiraUrlOne.value)
        store.set('jiraName', this.$refs.jiraName.value)
        store.set('jiraPass', this.$refs.jiraPass.value)

        setTimeout(function () {
          document.getElementById('saveAccountData').removeAttribute('disabled')
          $('#spinner').fadeOut()
        }, 500)
      },
      clearInputs () {
        // When we delete credentials, update it visually.
        let inputs = document.getElementsByClassName('input')
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].value = ''
        }
      }
    }
  }
</script>

<style>
</style>
