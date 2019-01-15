<template>
  <div>
    <section class="hero is-light is-small">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Accounts Overview
          </h1>
          <h2 class="subtitle">
            Quickly view which accounts and Jira URL's you have.
          </h2>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">

        <div class="columns">
          <div class="column is-6">

            <label class="label">Choose account</label>
            <div class="field">
              <input class="is-checkradio" id="exampleRadioInline1" type="radio" name="exampleRadioInline" checked="checked">
              <label for="exampleRadioInline1">{{ accountOneName }}</label>
              <br>
              <input class="is-checkradio" id="exampleRadioInline2" type="radio" name="exampleRadioInline">
              <label for="exampleRadioInline2">Option 2</label>
            </div>

          </div> <!-- End of first column -->

          <div class="column is-5">
          </div> <!-- End of second column -->

        </div> <!-- End of all columns -->
      </div>
    </section>
  </div>
</template>

<script>
  const Store = require('electron-store')
  const store = new Store()

  export default {
    name: 'accounts-overview',
    data () {
      return {
        accountOneName: store.get('accountOneName') ? store.get('accountOneName') : '',
        jiraUrl: store.get('jiraUrl') ? store.get('jiraUrl') : '',
        jiraName: store.get('jiraName') ? store.get('jiraName') : '',
        jiraPass: store.get('jiraPass') ? store.get('jiraPass') : '',
        togglApiKey: store.get('togglApiKey') ? store.get('togglApiKey') : ''
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>
</style>
