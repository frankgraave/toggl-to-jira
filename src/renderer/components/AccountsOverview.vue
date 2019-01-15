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
          <div class="column is-5">

            <label class="label">Choose account</label>
            <!--Build check if any account is set anyway-->
            <div class="field">
              <input class="is-checkradio" id="accountOne" type="radio" value="accountOne" v-model="activeAccount" v-on:change="saveActiveAccount('accountOne')">
              <label for="accountOne">
                <a class="button is-light" type="button">{{ accountOneName }}</a>
              </label>
            </div>
            <div class="field">
              <input class="is-checkradio" id="accountTwo" type="radio" value="accountTwo" v-model="activeAccount" v-on:change="saveActiveAccount('accountTwo')">
              <label for="accountTwo">
                <a class="button is-light" type="button">{{ accountTwoName }}</a>
              </label>
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
  import $ from 'jquery'

  const Store = require('electron-store')
  const store = new Store()

  export default {
    name: 'accounts-overview',
    data () {
      return {
        activeAccount: store.get('activeAccount') ? store.get('activeAccount') : '',
        accountOneName: store.get('accountOneName') ? store.get('accountOneName') : '',
        accountTwoName: store.get('accountTwoName') ? store.get('accountTwoName') : '',
        accountOneJiraUrl: store.get('accountOneJiraUrl') ? store.get('accountOneJiraUrl') : '',
        accountTwoJiraUrl: store.get('accountTwoJiraUrl') ? store.get('accountTwoJiraUrl') : '',
        togglApiKey: store.get('togglApiKey') ? store.get('togglApiKey') : ''
      }
    },
    mounted () {
    },
    methods: {
      saveActiveAccount (value) {
        // Activate spinner.
        $('#spinner').fadeIn()
        // Interval for spinner.
        setTimeout(function () {
          // Save radio.
          store.set('activeAccount', value)
          $('#spinner').fadeOut()
        }, 500)
      }
    }
  }
</script>

<style>
  @import '~bulma-checkradio';

  .is-checkradio[type=checkbox]+label,
  .is-checkradio[type=radio]+label {
    margin: 0;
    padding: .0rem .5rem .0rem 2rem;
  }

</style>
