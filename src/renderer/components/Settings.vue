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
        <div class="columns">
          <div class="column is-5">
            <!--Column 1 - Field 1-->
            <div class="field">
              <label class="label">Current used Jira Board</label>
              <div class="control">
                <input class="input" type="text" ref="jiraUrl" v-bind:value="jiraUrl" disabled>
              </div>
              <p class="help"><em>Note: this URL is the one that's being used for the REST API calls. Adjust this URL in the <router-link to="/jira-board-settings">Jira Boards</router-link> Settings.</em></p>
            </div>
            <!--Column 1: Field 2-->
            <div class="field">
              <div class="label">Ignore this project</div>
              <div class="field-body">
                <div class="field is-expanded">
                  <div class="field has-addons">
                    <p class="control is-expanded has-icons-left">
                      <input class="input" type="text" ref="ignoreProjectKey" v-bind:value="ignoreProjectKey" placeholder="e.g. BEN">
                      <span class="icon is-small is-left">
                        <fa :icon="['fas', 'eye-slash']" />
                      </span>
                    </p>
                    <p class="control">
                      <a class="button is-static">-XXXXX</a>
                    </p>
                  </div>
                  <p class="help"><em>Note: Case sensitive. This project will be filtered out of the list of tickets that can be synced.</em></p>
                </div>
              </div>
            </div>
            <!--Column 1: Controls-->
            <!-- TODO: Bind click function with update/loader -->
            <button id="saveSettings" class="button is-dark" v-on:click="saveSettings">
              Save
            </button>
          </div> <!-- End of first column -->
          <div class="column is-5">
            <!--Column 2: Field 1-->
            <div class="field">
              <label class="label">Logged tag</label>
              <div class="control has-icons-left">
                <input class="input" type="text" ref="loggedTag" v-bind:value="loggedTag" placeholder="e.g. logged">
                <span class="icon is-small is-left">
                  <fa :icon="['fas', 'check']" />
                </span>
              </div>
              <p class="help"><em>Note: Case sensitive. After syncing these tickets will be tagged with this value in Toggl.</em></p>
            </div>
            <!--Column 2: Field 2-->
            <div class="field">
              <label class="label">Ignore tag</label>
              <div class="control has-icons-left">
                <input class="input" type="text" ref="ignoreTag" v-bind:value="ignoreTag" placeholder="e.g. Ignore">
                <span class="icon is-small is-left">
                  <fa :icon="['fas', 'eye-slash']" />
                </span>
              </div>
              <p class="help"><em>Note: Case sensitive. After syncing these tickets will be ignored in this application.</em></p>
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

  store.set('jiraUrl', 'jira.goalgorilla.com')

  export default {
    name: 'settings',
    data () {
      return {
        ignoreProjectKey: store.get('ignoreProjectKey'),
        loggedTag: store.get('loggedTag'),
        ignoreTag: store.get('ignoreTag'),
        jiraUrl: store.get('jiraUrl')
      }
    },
    methods: {
      saveSettings () {
        document.getElementById('saveSettings').classList.add('is-loading')
        document.getElementById('saveSettings').classList.add('is-warning')

        store.set('ignoreProjectKey', this.$refs.ignoreProjectKey.value)
        store.set('loggedTag', this.$refs.loggedTag.value)
        store.set('ignoreTag', this.$refs.ignoreTag.value)

        setTimeout(function () {
          document.getElementById('saveSettings').classList.remove('is-loading')
          document.getElementById('saveSettings').classList.remove('is-warning')
        }, 300)
      }
    }
  }
</script>

<style>
  p.help {
    color: #999999;
  }
</style>
