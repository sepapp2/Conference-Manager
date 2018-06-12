<template>
<b-container>
<h1>Conferences</h1>
  <b-row>
    <b-col md="5" offset-md="7" class="my-1">
      <b-input-group>
        <b-form-input v-model="filter" placeholder="Type to Search" />
        <b-input-group-append>
        <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
        </b-input-group-append>
      </b-input-group>
    </b-col>
  </b-row>
  <b-table striped
           hover
           :items="conferences"
           :fields="fields"
           :filter="filter"
  >
  <template slot="startDateTime" slot-scope="data">
      {{data.item.startDateTime | moment("dddd, MMMM Do YYYY, h:mm a") }}
  </template>
  <template slot="registrationDateTime" slot-scope="data">
      {{data.item.registrationDateTime | moment("dddd, MMMM Do YYYY, h:mm a") }}
  </template>
  <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button size="sm" variant="success" class="mr-1" :to="{ name: 'Register', params: { conferenceId: row.item.id } }">
          Register
        </b-button>
  </template>
  </b-table>
</b-container>
</template>

<script>
import { db } from '../main'

export default {
  name: 'Conferences',
  data () {
    return {
      fields: [
        { key: 'title', label: 'Title', sortable: true },
        { key: 'description', label: 'Summary' },
        { key: 'startDateTime', label: 'Conference Date' },
        { key: 'registrationDateTime', label: 'Registration Deadline' },
        { key: 'actions', label: 'Actions' }
      ],
      conferences: [],
      filter: null
    }
  },
  firestore () {
    return {
      conferences: db.collection('Conferences').where('registrationDateTime', '>=', new Date())
    }
  }
}
</script>

<style scoped>
</style>
