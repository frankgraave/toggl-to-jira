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
            <!--Build check if any account is set anyway-->
            <div class="field">
              <input class="is-checkradio" id="accountOne" type="radio" v-bind:value="accountOneName" v-model="activeAccount" v-on:change="saveActiveAccount(accountOneName)">
              <label for="accountOne">{{ accountOneName }} <em>({{ jiraUrlOne }})</em></label>
              <br>
              <input class="is-checkradio" id="accountTwo" type="radio" v-bind:value="accountTwoName" v-model="activeAccount" v-on:change="saveActiveAccount(accountTwoName)">
              <label for="accountTwo">{{ accountTwoName }} <em>({{ jiraUrlTwo }})</em></label>
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
        accountTwoName: store.get('accountTwoName') ? store.get('accountTwoName') : '',
        activeAccount: store.get('activeAccount') ? store.get('activeAccount') : '',
        jiraUrlOne: store.get('jiraUrlOne') ? store.get('jiraUrlOne') : '',
        jiraUrlTwo: store.get('jiraUrlTwo') ? store.get('jiraUrlTwo') : '',
        jiraName: store.get('jiraName') ? store.get('jiraName') : '',
        jiraPass: store.get('jiraPass') ? store.get('jiraPass') : '',
        togglApiKey: store.get('togglApiKey') ? store.get('togglApiKey') : ''
      }
    },
    mounted () {
    },
    methods: {
      saveActiveAccount (value) {
        store.set('activeAccount', value)
      }
    }
  }
</script>

<style>
</style>
