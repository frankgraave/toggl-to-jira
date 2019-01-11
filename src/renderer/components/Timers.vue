<template>
  <div>
    <template v-if="togglApiKey === ''">
      <section class="section">
        <div class="container">
          <div class="column is-11">
            <article class="message is-warning">
              <div class="message-header">Uh-oh!</div>
              <div class="message-body">
                Please set up your <router-link to="/index">credentials</router-link> first!
              </div>
            </article>
          </div>
        </div>
      </section>
    </template>
    <template v-else-if="togglEntriesData === null">
      <article class="message is-success">
        <div class="message-header">No entries</div>
        <div class="message-body">
          If you expect entries, check your <router-link to="/settings">settings</router-link>. Otherwise, great job on logging all your hours!
        </div>
      </article>
    </template>
    <template v-else>
      <section class="section is-paddingless">
        <div class="table is-fullwidth is-striped">
          <thead>
          <tr>
            <th width="5%">Ticket</th>
            <th width="23%">Description</th>
            <th width="1%">Duration</th>
            <th width="2%">Date</th>
            <th width="9%">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <!-- When we do the for each here, make the ticket nr clickable? -->
            <td>OSSUPPORT-1928</td>
            <td>This is a description</td>
            <td>00:15:00</td>
            <td>5 Jan</td>
            <td>1</td>
          </tr>
          <tr>
            <td>OSSUPPORT-1928</td>
            <td>This is a description</td>
            <td>00:15:00</td>
            <td>5 Jan</td>
            <td>1</td>
          </tr>
          </tbody>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
  const Store = require('electron-store')
  const store = new Store()

  export default {
    name: 'timers',
    data () {
      return {
        togglEntriesData: null,
        togglApiKey: store.get('toggl-api-key')
      }
    }
  }
</script>
