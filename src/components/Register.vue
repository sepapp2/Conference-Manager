<template>
  <b-container>
    <h2>Register for {{conference.title}}</h2>
        <b-row>
          <b-col>
            <b-img :src=conference.logoURL fluid thumbnail alt="Event Logo" />
          </b-col>
        </b-row>
        <b-row v-if="conference.askCME" class="form-row-margin">
          <b-col md="6" class="text-left">
              <b-form-checkbox id="checkboxCME"
                     v-model="model.cmeCredit"
                     >
                     I am requesting CME credit for this Event
              </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row v-if="conference.askTShirt">
            <b-col md="6">
                <b-form-group id="conferenceTShirtInputGroup"
                                label="Choose a T-Shirt Size"
                                label-for="conferenceTShirtInput">
                    <b-form-select v-model="model.tShirtSize" :options="tShirtOptions" class="mb-3" />
                </b-form-group>
            </b-col>
        </b-row>
        <b-row v-if="conference.askLunch">
            <b-col md="6">
                <b-form-group id="conferenceLunchInputGroup"
                                label="Choose a Lunch Option"
                                label-for="conferenceLunchInput">
                    <b-form-select v-model="model.lunchSelection" :options="lunchOptions" class="mb-3" />
                </b-form-group>
            </b-col>
        </b-row>
        <b-row v-if="conference.askDinner">
            <b-col md="6">
                <b-form-group id="conferenceDinnerInputGroup"
                                label="Choose a Dinner Option"
                                label-for="conferenceDinnerInput">
                    <b-form-select v-model="model.dinnerSelection" :options="dinnerOptions" class="mb-3" />
                </b-form-group>
            </b-col>
        </b-row>
        <b-row v-if="conference.askSpecialNeeds">
            <b-col>
              <b-form-group id="conferenceSpecialNeedsInputGroup"
                            label="Special Needs (500 character limit)"
                            label-for="conferenceSpecialNeedsInput"
                            :description="(500-model.specialNeeds.length).toString() + ' characters remaining'"
                            >
                <b-form-textarea v-model="model.specialNeeds"
                  type="textarea"
                  placeholder="Please let us know of any special needs (mobility/food allergies/etc.)"
                  :rows="4"
                  maxlength=500></b-form-textarea>
              </b-form-group>
            </b-col>
        </b-row>
        <b-row v-if="conference.askPosterJudging" class="form-row-margin">
          <b-col md="6" class="text-left">
              <b-form-checkbox id="checkboxPosterJudging"
                     v-model="model.posterJudging"
                     >
                     I am interested in judging posters for this Event
              </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row v-if="conference.askPosterSpecifics">
          <b-col md="6">
            <b-form-group id="conferencePosterSpecificsInputGroup"
                          label="Poster Abstract Submission"
                          label-for="conferencePosterSpecificsInput">
              <b-form-select v-model="model.posterSubmission" :options="posterSpecificOptions" class="mb-3" />
            </b-form-group>
          </b-col>
        </b-row>
        <div v-if="model.posterSubmission == 'I WILL submit an abstract and will enter it now'">
          <b-row>
            <b-col md="6">
              <b-form-group id="conferencePosterCategoryInputGroup"
                            label="Submission Category"
                            label-for="conferencePosterCategoryInput">
                <b-form-select v-model="model.posterSubmissionCategory" :options="posterCategoryOptions" class="mb-3" />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group id="conferencePosterSubmissionTitleInputGroup"
                            label="Submission Title"
                            label-for="conferencePosterSubmissionTitleInput">
                <b-input-group size="lg" :append="(150-model.posterSubmissionTitle.length).toString() + ' characters remaining'">
                <b-form-input v-model="model.posterSubmissionTitle"
                  type="text"
                  placeholder="Enter your Poster Title"
                  maxlength=150></b-form-input>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group id="conferencePosterSubmissionAbstractInputGroup"
                            label="Submission Abstract (3000 character limit)"
                            label-for="conferencePosterSubmissionAbstractInput"
                            :description="(3000-model.posterSubmissionAbstract.length).toString() + ' characters remaining'"
                            >
                <b-form-textarea v-model="model.posterSubmissionAbstract"
                  type="textarea"
                  placeholder="Enter your Poster Abstract"
                  :rows="12"
                  maxlength=3000></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
      <b-button variant="success" type="submit" validateBeforeSubmit=true @click="register()">Register</b-button>
  </b-container>
</template>

<script>
import { db } from '../main'

export default {
  name: 'Register',
  firestore () {
    return {
      conference: db.collection('Conferences').doc(this.$router.currentRoute.params.conferenceId)
    }
  },
  data () {
    return {
      posterSpecificOptions: [
        {value: null, text: 'Please choose whether or not you will submit an abstract'},
        'I am not submitting an abstract',
        'I WILL submit an abstract and will enter it now',
        'I WILL BE submitting an abstract and will come back later and submit it'
      ],
      posterCategoryOptions: [
        {value: null, text: 'Please choose a submission category'},
        'Student',
        'Fellow',
        'Faculty',
        'Staff',
        'Other'
      ],
      tShirtOptions: [
        {value: null, text: 'Please select a T-Shirt Size'},
        {value: 'Small', text: 'Small'},
        {value: 'Medium', text: 'Medium'},
        {value: 'Large', text: 'Large'},
        {value: 'XL', text: 'X-Large'},
        {value: 'XXL', text: 'XX-Large'}
      ],
      lunchOptions: [
        {value: null, text: 'Please choose a lunch option'},
        {value: 'Beef', text: 'Beef'},
        {value: 'Chicken', text: 'Chicken'},
        {value: 'Fish', text: 'Fish'},
        {value: 'Vegetarian', text: 'Vegetarian'}
      ],
      dinnerOptions: [
        {value: null, text: 'Please choose a dinner option'},
        {value: 'Beef', text: 'Beef'},
        {value: 'Chicken', text: 'Chicken'},
        {value: 'Fish', text: 'Fish'},
        {value: 'Vegetarian', text: 'Vegetarian'}
      ],
      formOptions: {
        validateAfterChanged: true
      },
      conference: [],
      model: {
        posterSubmissionAbstract: '',
        specialNeeds: '',
        posterSubmissionTitle: '',
        conference: {}
      },
      formValid: false
    }
  },
  methods: {
    onValidated (isValid, errors) {
      if (isValid) {
        this.formValid = true
      } else {
        this.formValid = false
      }
    },
    register () {
      var modelData = this
      var docRef = db.collection('Registrations').where('userId', '==', this.$store.getters.getUser.uid).where('conference.Id', '==', this.$router.currentRoute.params.conferenceId)
      docRef.get().then(doc => {
        if (!doc.empty) {
          alert('You have already registered for this conference previously.  Please check your "My Conferences" tab to view the details.')
        } else {
          // doc.data() will be undefined in this case
          modelData.model.conference = modelData.conference
          delete modelData.model.conference.lunchesNeeded
          delete modelData.model.conference.dinnersNeeded
          delete modelData.model.conference.tShirtsNeeded
          modelData.model.userId = modelData.$store.getters.getUser.uid
          modelData.model.displayName = modelData.$store.getters.getUser.displayName
          modelData.model.email = modelData.$store.getters.getUser.email
          modelData.model.conference.Id = this.$router.currentRoute.params.conferenceId
          if (this.model.posterSubmission !== 'I WILL submit an abstract and will enter it now') {
            this.model.posterSubmissionCategory = ''
            this.model.posterSubmissionTitle = ''
            this.model.posterSubmissionAbstract = ''
          }
          var batch = db.batch()
          db.collection('Registrations').add(modelData.model)
            .then(docRef => {
              alert('Registration Successful')
              // Create a reference to the Conference doc.
              var conferenceDocRef = db.collection('Conferences').doc(this.$router.currentRoute.params.conferenceId)
              return db.runTransaction(transaction => {
                return transaction.get(conferenceDocRef).then(conferenceDoc => {
                  if (!conferenceDoc.exists) {
                    throw new Error('Document does not exist!')
                  }
                  var newRegistrantCount = (conferenceDoc.data().registrants || 0) + 1
                  batch.update(conferenceDocRef, {registrants: newRegistrantCount})
                  if (modelData.model.lunchSelection) {
                    var lunchUpdate = 'lunchesNeeded.' + modelData.model.lunchSelection
                    var newLunchCount = (conferenceDoc.data().lunchesNeeded[modelData.model.lunchSelection] || 0) + 1
                    batch.update(conferenceDocRef, {[lunchUpdate]: newLunchCount})
                  }
                  if (modelData.model.dinnerSelection) {
                    var dinnerUpdate = 'dinnersNeeded.' + modelData.model.dinnerSelection
                    var newDinnerCount = (conferenceDoc.data().dinnersNeeded[modelData.model.dinnerSelection] || 0) + 1
                    batch.update(conferenceDocRef, {[dinnerUpdate]: newDinnerCount})
                  }
                  if (modelData.model.tShirtSize) {
                    var tShirtUpdate = 'tShirtsNeeded.' + modelData.model.tShirtSize
                    var newTShirtCount = (conferenceDoc.data().tShirtsNeeded[modelData.model.tShirtSize] || 0) + 1
                    batch.update(conferenceDocRef, {[tShirtUpdate]: newTShirtCount})
                  }
                  batch.commit().then(x => {
                    this.$router.replace('/myconferences')
                  })
                })
              }).then(x => {
                console.log('Transaction successfully committed!')
                this.$router.replace('/myconferences')
              }).catch(function (error) {
                console.log('Transaction failed: ', error)
              })
            }).catch(function (error) {
              console.log('Transaction failed: ', error)
            })
        }
      }).catch(function (error) {
        console.log('Error getting document: ', error)
      })
    }
  }
}
</script>

<style scoped>
.vue-form-generator {
  text-align: left;
}
.btn {
  border-radius: 0px;
}
.b-form-group {
  text-align: left;
}
.form-row-margin {
  margin-bottom: 15px;
}
</style>
