<template>
    <div>
        <section class="hero is-light is-small">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        Jira Project(s) Settings
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
                            <label class="label">Jira Project Url(s)</label>
                            <div class="control has-icons-left">
                                <input class="input" type="text" ref="jiraProjectUrl1" v-bind:value="jiraProjectUrl1" placeholder="https://...">
                                <span class="icon is-small is-left">
                                    <fa :icon="['fab', 'jira']" />
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control has-icons-left">
                                <input class="input" type="text" ref="jiraProjectUrl2" v-bind:value="jiraProjectUrl2" placeholder="https://...">
                                <span class="icon is-small is-left">
                                    <fa :icon="['fab', 'jira']" />
                                </span>
                            </div>
                        </div>
                        <div class="field">
                            <div class="control has-icons-left">
                                <input class="input" type="text" ref="jiraProjectUrl3" v-bind:value="jiraProjectUrl3" placeholder="https://...">
                                <span class="icon is-small is-left">
                                    <fa :icon="['fab', 'jira']" />
                                </span>
                            </div>
                        </div>
                        <!--Column 1 - Controls-->
                        <button id="saveJiraBoardSettings" class="button is-dark" v-on:click="saveJiraBoardSettings">
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
        jiraProjectUrl1: store.get('jiraProjectUrl1'),
        jiraProjectUrl2: store.get('jiraProjectUrl2'),
        jiraProjectUrl3: store.get('jiraProjectUrl3')
      }
    },
    methods: {
      saveJiraBoardSettings () {
        document.getElementById('saveJiraBoardSettings').classList.add('is-loading')
        document.getElementById('saveJiraBoardSettings').classList.add('is-warning')

        store.set('jiraProjectUrl1', this.$refs.jiraProjectUrl1.value)
        store.set('jiraProjectUrl2', this.$refs.jiraProjectUrl2.value)
        store.set('jiraProjectUrl3', this.$refs.jiraProjectUrl3.value)

        setTimeout(function () {
          document.getElementById('saveJiraBoardSettings').classList.remove('is-loading')
          document.getElementById('saveJiraBoardSettings').classList.remove('is-warning')
        }, 300)
      }
    }
  }
</script>

<style>

</style>
