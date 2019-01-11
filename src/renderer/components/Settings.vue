<template>
  <div>
    <section class="hero is-light is-small">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Settings
          </h1>
          <h2 class="subtitle">
            Your specific settings for Ignoring and Logging your tickets/projects.
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <!--<h4 class="title">Settings</h4>-->
        <div class="columns">
          <div class="column is-5">
            <!--Container oid?-->
            <!--Column 1 - Field 1-->
            <div class="field">
              <label class="label">Current used Jira Board</label>
              <div class="control">
                <input class="input" type="text" ref="jiraUrl" v-bind:value="jiraUrl" disabled>
              </div>
              <p class="help"><strong>Note:</strong> this URL is the one that's being used for the REST API calls. Adjust this URL in the <router-link to="/jira-board-settings">Jira Boards</router-link> Settings.</p>
            </div>
            <!--Column 1 - Field 1-->
            <div class="field">
              <div class="label">Ignore this project</div>
              <div class="field-body">
                <div class="field is-expanded">
                  <div class="field has-addons">
                    <p class="control is-expanded">
                      <input class="input" type="text" ref="ignoreProjectKey" v-bind:value="ignoreProjectKey" placeholder="e.g. BEN">
                    </p>
                    <p class="control">
                      <a class="button is-static">-XXXXX</a>
                    </p>
                  </div>
                  <p class="help"><strong>Note:</strong> Case sensitive. This project will be filtered out of the list of tickets that can be synced.</p>
                </div>
              </div>
            </div>
            <!--Column 1 - Controls-->
            <!-- TODO: Bind click function with update/loader -->
            <button id="saveSettings" class="button is-dark" v-on:click="saveSettings">
              Save
            </button>
          </div> <!-- End of first column -->
          <div class="column is-5">
            <!--Column 2 - Field 1-->
            <div class="field">
              <label class="label">Logged tag</label>
              <div class="control">
                <input class="input" type="text" ref="loggedTag" v-bind:value="loggedTag" placeholder="e.g. logged">
              </div>
              <p class="help"><strong>Note:</strong> Case sensitive. After syncing these tickets will be tagged with this value in Toggl.</p>
            </div>
            <!--Column 2 - Field 2-->
            <div class="field">
              <label class="label">Ignore tag</label>
              <div class="control">
                <input class="input" type="text" ref="ignoreTag" v-bind:value="ignoreTag" placeholder="e.g. Ignore">
              </div>
              <p class="help"><strong>Note:</strong> Case sensitive. After syncing these tickets will be <strong>Ignored</strong> in this application.</p>
            </div>
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
    name: 'settings',
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
