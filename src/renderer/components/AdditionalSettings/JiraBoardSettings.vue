<template>
    <section class="section">
        <div class="container">

            <h4 class="title">Settings</h4>
            <div class="columns">
                <div class="column is-5">
                    <!--Container oid?-->
                    <!--Column 1 - Field 1-->
                    <div class="field">
                        <label class="label">Your Jira Board</label>
                        <div class="control">
                            <input class="input" type="text" ref="jiraUrl" v-bind:value="jiraUrl" placeholder="https://...">
                        </div>
                        <p class="help">The URL to your Jira installation.</p>
                    </div>
                    <div class="field">
                        <label class="label">Your Jira Board</label>
                        <div class="control">
                            <input class="input" type="text" ref="jiraUrl" v-bind:value="jiraUrl" placeholder="https://...">
                        </div>
                        <p class="help">The URL to your Jira installation.</p>
                    </div>
                    <div class="field">
                        <label class="label">Your Jira Board</label>
                        <div class="control">
                            <input class="input" type="text" ref="jiraUrl" v-bind:value="jiraUrl" placeholder="https://...">
                        </div>
                        <p class="help">The URL to your Jira installation.</p>
                    </div>
                    <!--Column 1 - Controls-->
                    <button id="saveSettings" class="button is-dark" v-on:click="saveSettings">
                        Save
                    </button>
                </div> <!-- End of first column -->
                <div class="column is-5">
                </div> <!-- End of second column -->
            </div> <!-- End of columns -->
        </div>
    </section>
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
