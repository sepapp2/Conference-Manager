<template>
<b-container class="text-left">
<h1>Abstracts</h1>
<div v-for="(abstract, idx) in abstracts" :key="idx" class="abstract-item">
    <b-row>
        <b-col md="12">
            <b>{{abstract.posterSubmissionTitle}}</b>
        </b-col>
    </b-row>
    <b-row>
        <b-col md="12">
            <b><i>{{abstract.posterSubmissionCategory}}</i></b>
        </b-col>
    </b-row>
    <b-row>
        <b-col md="12">
            {{abstract.posterSubmissionAbstract}}
        </b-col>
    </b-row>
    <hr>
</div>
</b-container>
</template>

<script>
import { db } from '../main'

export default {
  name: 'AbstractBook',
  data () {
    return {
      abstracts: {}
    }
  },
  firestore () {
    return {
      abstracts: db.collection('Registrations').where('conference.Id', '==', this.$router.currentRoute.params.conferenceId)
    }
  }
}
</script>
<style scoped>
@media print {
    .abstract-item {
        page-break-after: always;
    }
    hr {
        display: none;
    }
}
</style>
