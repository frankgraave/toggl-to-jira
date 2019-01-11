<template>
    <div>
        <section class="hero is-light is-small">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Jira Board Settings
                    </h1>
                    <h2 class="subtitle">
                        Here you can define multiple Jira installations for if you are working on multiple projects.
                    </h2>
                </div>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="columns">
                    <div class="column is-6">
                        <!--Column 1 - Field 1-->
                        <div class="field">
                            <label class="label">Jira REST API Url(s)</label>
                            <div class="control has-icons-left">
                                <input class="input" type="text" ref="jiraUrl" v-bind:value="jiraUrl" placeholder="https://...">
                                <span class="icon is-small is-left">
                                    <fa :icon="['fab', 'jira']" />
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control has-icons-left">
                                <input class="input" type="text" ref="jiraUrl" v-bind:value="jiraUrl" placeholder="https://...">
                                <span class="icon is-small is-left">
                                    <fa :icon="['fab', 'jira']" />
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control has-icons-left">
                                <input class="input" type="text" ref="jiraUrl" v-bind:value="jiraUrl" placeholder="https://...">
                                <span class="icon is-small is-left">
                                    <fa :icon="['fab', 'jira']" />
                                </span>
                            </div>
                        </div>
                        <!--Column 1 - Controls-->
                        <button id="saveSettings" class="button is-dark" v-on:click="saveSettings">
                            Save
                        </button>
                    </div> <!-- End of first column -->
                    <div class="column is-5">
                        <label class="label">&nbsp;</label>
                        <article class="message is-info is-small">
                            <div class="message-header">Note</div>
                            <div class="message-body">
                                Enter the project REST API Url's here. If you have two different boards using the same ticket key's, then please select a specific one to use in the <router-link to="/settings">settings</router-link>.
                            </div>
                        </article>
                    </div> <!-- End of second column -->
                </div> <!-- End of columns -->
            </div>
        </section>
    </div>
</template>

<script>
  const Store = require('electron-store')
  const store = new Store()

  export default {
    name: 'jira-board-settings',
    data () {
      return {
        ignoreProjectKey: store.get('ignoreProjectKey'),
        loggedTag: store.get('loggedTag')
      }
    },
    mounted () {
      // When we receive the clearCredentials event that is
      // emitted from src/renderer/App.vue, we clear the data
      // as requested.
      this.$electron.ipcRenderer.on('clearAllSettings', () => {
        document.getElementById('saveSettings').setAttribute('disabled', true)
        // Only delete these, since we have other settings.
        store.set('ignoreProjectKey', '')
        store.set('loggedTag', '')
        this.clearInputs()
        setTimeout(function () {
          document.getElementById('saveSettings').removeAttribute('disabled')
        }, 500)
      })
    },
    methods: {
      saveSettings () {
        document.getElementById('saveSettings').classList.add('is-loading')
        document.getElementById('saveSettings').classList.add('is-warning')

        store.set('ignoreProjectKey', this.$refs.ignoreProjectKey.value)
        store.set('loggedTag', this.$refs.loggedTag.value)

        setTimeout(function () {
          document.getElementById('saveSettings').classList.remove('is-loading')
          document.getElementById('saveSettings').classList.remove('is-warning')
        }, 300)
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
