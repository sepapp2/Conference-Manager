<template>
<b-container fluid>
<h1>My Conferences</h1>
  <b-row>
    <!-- <b-col md="3" offset-md="4" class="my-1">
      <b-form-checkbox id="conferenceStatus"
                     v-model="conferenceStatus"
                     value="true"
                     unchecked-value="false"
                     @input="filter = ''">
      Active Conferences
    </b-form-checkbox>
    </b-col> -->
    <b-col md="3" class="my-1">
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
           :items="myConferences"
           :fields="fields"
           :filter="filter"
  >
  <template slot="conference.startDateTime" slot-scope="data">
      {{data.item.conference.startDateTime | moment("from", "now") }}
  </template>
  <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        <b-button v-if="!row.item.isAdmin" size="sm" variant="success" class="mr-1" @click="setConference(row.item.conference.Id)" v-b-modal.editRegistration>
          Details
        </b-button>
        <b-button v-if="row.item.isAdmin" size="sm" variant="default" class="mr-1" @click="setStatus(row.item.conference.Id)" v-b-modal.editConference>
          Edit Conference
        </b-button>
        <b-button v-if="row.item.isAdmin" size="sm" variant="warning" class="mr-1" @click="setRegistrants(row.item.conference.Id)" v-b-modal.editRegistrants>
          Manage Registrants
        </b-button>
        <b-button size="sm" variant="info" class="mr-1" :to="{ name: 'AbstractBook', params: { conferenceId: row.item.conference.Id } }">
          Abstract Book
        </b-button>
        <b-button v-if="row.item.isAdmin" size="sm" variant="secondary" class="mr-1" @click="setAtendeeDetails(row.item.conference.Id)" v-b-modal.viewDetails>
          Attendee Details
        </b-button>
  </template>
  </b-table>
  <!-- Modal Component Edit Registration-->
    <b-form class="modal-form">
    <b-modal  id="editRegistration"
              size="lg"
              ref="editRegistration"
              title="Edit My Conference Registration"
              ok-title="Submit"
              @ok="onEventSubmit">
       <b-row v-if="model.conference.askCME" class="form-row-margin">
          <b-col md="12" class="text-left">
              <b-form-checkbox id="checkboxCME"
                     v-model="model.cmeCredit"
                     >
                     I am requesting CME credit for this Event
              </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row v-if="model.conference.askTShirt">
            <b-col md="6">
                <b-form-group id="conferenceTShirtInputGroup"
                                label="Choose a T-Shirt Size"
                                label-for="conferenceTShirtInput">
                    <b-form-select v-model="model.tShirtSize" :options="tShirtOptions" class="mb-3" />
                </b-form-group>
            </b-col>
        </b-row>
        <b-row v-if="model.conference.askLunch">
            <b-col md="6">
                <b-form-group id="conferenceLunchInputGroup"
                                label="Choose a Lunch Option"
                                label-for="conferenceLunchInput">
                    <b-form-select v-model="model.lunchSelection" :options="lunchOptions" class="mb-3" />
                </b-form-group>
            </b-col>
        </b-row>
        <b-row v-if="model.conference.askDinner">
            <b-col md="6">
                <b-form-group id="conferenceDinnerInputGroup"
                                label="Choose a Dinner Option"
                                label-for="conferenceDinnerInput">
                    <b-form-select v-model="model.dinnerSelection" :options="dinnerOptions" class="mb-3" />
                </b-form-group>
            </b-col>
        </b-row>
        <b-row v-if="model.conference.askSpecialNeeds">
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
        <b-row v-if="model.conference.askPosterJudging" class="form-row-margin">
          <b-col md="12" class="text-left">
              <b-form-checkbox id="checkboxPosterJudging"
                     v-model="model.posterJudging"
                     >
                     I am interested in judging posters for this Event
              </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row v-if="model.conference.askPosterSpecifics">
          <b-col md="8">
            <b-form-group id="conferencePosterSpecificsInputGroup"
                          label="Poster Abstract Submission"
                          label-for="conferencePosterSpecificsInput">
              <b-form-select v-model="model.posterSubmission" :options="posterSpecificOptions" class="mb-3" />
            </b-form-group>
          </b-col>
        </b-row>
        <div v-if="model.posterSubmission == 'I WILL submit an abstract and will enter it now'">
          <b-row>
            <b-col md="8">
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
        </div>              <!-- <b-button variant="success" type="submit" validateBeforeSubmit=true @click="register()">Register</b-button> -->
    </b-modal>
    </b-form>
  <!-- Modal Component Edit Registrants-->
    <b-form class="modal-form">
    <b-modal  id="editRegistrants"
              size="lg"
              ref="editRegistrants"
              title="Edit Conference Registrants"
              hide-footer
              ok-title="Submit"
              @hide="resetRegistrants">
              <b-table striped hover :items="registrants" :fields="registrantFields">
                <template slot="actions" slot-scope="row">
                  <b-button v-if="user.uid !== row.item.adminId" size="sm" variant="danger" class="mr-1" @click="removeUser(row.item.uid, editingConference)">
                    Remove User
                  </b-button>
                </template>
              </b-table>
    </b-modal>
    </b-form>
    <!-- Modal Component View Conference Details-->
    <b-modal  id="viewDetails"
              size="lg"
              ref="viewDetails"
              title="Conference Details"
              hide-footer
              ok-title="Submit"
              >
          <b-row class="modal-row-space">
            <b-col>
              <b-list-group>
                <b-list-group-item variant="primary" class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.registrants">
                  Number of Registrations
                  <b-badge variant="warning" v-if="conferenceDetails.registrants" pill>{{conferenceDetails.registrants}}</b-badge>
                </b-list-group-item>
              </b-list-group>
            </b-col>
          </b-row>
          <b-row class="modal-row-space">
            <b-col>
              <b-card-group deck v-if="conferenceDetails.lunchesNeeded">
                <b-card header="<b>Lunch Count</b>">
                  <b-list-group>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.lunchesNeeded.Beef">
                      Beef
                      <b-badge variant="primary" v-if="conferenceDetails.lunchesNeeded.Beef" pill>{{conferenceDetails.lunchesNeeded.Beef}}</b-badge>
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.lunchesNeeded.Chicken">
                      Chicken
                      <b-badge variant="primary" v-if="conferenceDetails.lunchesNeeded.Chicken" pill>{{conferenceDetails.lunchesNeeded.Chicken}}</b-badge>
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.lunchesNeeded.Fish">
                      Fish
                      <b-badge variant="primary" v-if="conferenceDetails.lunchesNeeded.Fish" pill>{{conferenceDetails.lunchesNeeded.Fish}}</b-badge>
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.lunchesNeeded.Vegetarian">
                      Vegetarian
                      <b-badge variant="primary" v-if="conferenceDetails.lunchesNeeded.Vegetarian" pill>{{conferenceDetails.lunchesNeeded.Vegetarian}}</b-badge>
                    </b-list-group-item>
                  </b-list-group>
                </b-card>
              </b-card-group>
            </b-col>
            <b-col>
              <b-card-group deck v-if="conferenceDetails.dinnersNeeded">
                <b-card header="<b>Dinner Count</b>">
                  <b-list-group>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.dinnersNeeded.Beef">
                      Beef
                      <b-badge variant="primary" v-if="conferenceDetails.dinnersNeeded.Beef" pill>{{conferenceDetails.dinnersNeeded.Beef}}</b-badge>
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.dinnersNeeded.Chicken">
                      Chicken
                      <b-badge variant="primary" v-if="conferenceDetails.dinnersNeeded.Chicken" pill>{{conferenceDetails.dinnersNeeded.Chicken}}</b-badge>
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.dinnersNeeded.Fish">
                      Fish
                      <b-badge variant="primary" v-if="conferenceDetails.dinnersNeeded.Fish" pill>{{conferenceDetails.dinnersNeeded.Fish}}</b-badge>
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.dinnersNeeded.Vegetarian">
                      Vegetarian
                      <b-badge variant="primary" v-if="conferenceDetails.dinnersNeeded.Vegetarian" pill>{{conferenceDetails.dinnersNeeded.Vegetarian}}</b-badge>
                    </b-list-group-item>
                  </b-list-group>
                </b-card>
              </b-card-group>
            </b-col>
            <b-col>
              <b-card-group deck v-if="conferenceDetails.tShirtsNeeded">
                <b-card header="<b>T-Shirt Count</b>">
                  <b-list-group>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.tShirtsNeeded.Small">
                      Small
                      <b-badge variant="primary" v-if="conferenceDetails.tShirtsNeeded.Small" pill>{{conferenceDetails.tShirtsNeeded.Small}}</b-badge>
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.tShirtsNeeded.Medium">
                      Medium
                      <b-badge variant="primary" v-if="conferenceDetails.tShirtsNeeded.Medium" pill>{{conferenceDetails.tShirtsNeeded.Medium}}</b-badge>
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.tShirtsNeeded.Large">
                      Large
                      <b-badge variant="primary" v-if="conferenceDetails.tShirtsNeeded.Large" pill>{{conferenceDetails.tShirtsNeeded.Large}}</b-badge>
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.tShirtsNeeded.XL">
                      X-Large
                      <b-badge variant="primary" v-if="conferenceDetails.tShirtsNeeded.XL" pill>{{conferenceDetails.tShirtsNeeded.XL}}</b-badge>
                    </b-list-group-item>
                    <b-list-group-item class="d-flex justify-content-between align-items-center" v-if="conferenceDetails.tShirtsNeeded.XXL">
                      XX-Large
                      <b-badge variant="primary" v-if="conferenceDetails.tShirtsNeeded.XXL" pill>{{conferenceDetails.tShirtsNeeded.XXL}}</b-badge>
                    </b-list-group-item>
                  </b-list-group>
                </b-card>
              </b-card-group>
            </b-col>
          </b-row>
    </b-modal>
  <!-- Modal Component Edit Conference-->
    <b-form @submit="onSubmit" @reset="onReset" v-if="show" class="modal-form">
    <b-modal  id="editConference"
              size="lg"
              ref="editConference"
              title="Edit Conference Details"
              @ok="onSubmit"
              @cancel="onReset"
              ok-title="Submit">
              <b-row>
                <b-col>
                  <b-img :src=form.logoURL fluid thumbnail alt="Event Logo" />
                </b-col>
              </b-row>
            <b-row>
            <b-col md="6">
                <b-form-group id="conferenceTitleInputGroup"
                                label="Conference or Event Title:"
                                label-for="conferenceTitleInput">
                    <b-form-input id="conferenceTitleInput"
                                type="text"
                                v-model="form.title"
                                required
                                placeholder="Enter a title">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group id="conferenceLogoInputGroup"
                                label="Replace Logo"
                                label-for="conferenceLogoInput">
                    <b-form-file v-model="file" ref="fileinput" accept="image/*" :state="Boolean(file)" placeholder="Choose a file..." @change="detectFiles($event.target.files)"></b-form-file>
                    <div class="progress-bar" :style="{ width: progressUpload + '%'}">{{ progressUpload }}%</div>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="12">
                <b-form-group id="conferenceDescriptionInputGroup"
                                label="Description"
                                label-for="conferenceDescriptionInput">
                    <b-form-textarea id="conferenceDescription"
                            v-model="form.description"
                            placeholder="Please enter some descriptive text about your conference or event."
                            :rows="3"
                            :max-rows="6">
                    </b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6">
                <b-form-group id="conferenceStartDateInputGroup"
                                label="Start Date:"
                                label-for="conferenceStartDateInput">
                    <b-form-input id="conferenceStartDateInput"
                                type="date"
                                v-model="form.startDate"
                                required
                                >
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group id="conferenceStartTimeInputGroup"
                                label="Start Time:"
                                label-for="conferenceStartTimeInput">
                    <b-form-input id="conferenceStartTimeInput"
                                type="time"
                                v-model="form.startTime"
                                required
                                >
                    </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6">
                <b-form-group id="conferenceEndDateInputGroup"
                                label="End Date:"
                                label-for="conferenceEndDateInput">
                    <b-form-input id="conferenceEndDateInput"
                                type="date"
                                v-model="form.endDate"
                                required
                                >
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group id="conferenceEndTimeInputGroup"
                                label="End Time:"
                                label-for="conferenceEndTimeInput">
                    <b-form-input id="conferenceEndTimeInput"
                                type="time"
                                v-model="form.endTime"
                                required
                                >
                    </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6">
                <b-form-group id="conferenceRegistrationDeadlineDateInputGroup"
                                label="Registration Deadline Date:"
                                label-for="conferenceRegistrationDeadlineDateInput">
                    <b-form-input id="conferenceRegistrationDeadlineDateInput"
                                type="date"
                                v-model="form.registrationDeadlineDate"
                                required
                                >
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group id="conferenceRegistrationDeadlineTimeInputGroup"
                                label="Registration Deadline Time:"
                                label-for="conferenceRegistrationDeadlineTimeInput">
                    <b-form-input id="conferenceRegistrationDeadlineTimeInput"
                                type="time"
                                v-model="form.registrationDeadlineTime"
                                required
                                >
                    </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
          <b-col md="6" class="text-left">
              <b-form-checkbox id="checkboxTshirt"
                     v-model="form.askTShirt"
                     >
                     Ask Users T-Shirt Size
              </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" class="text-left">
              <b-form-checkbox id="checkboxLunch"
                     v-model="form.askLunch"
                     >
                     Ask Users Lunch Selection
              </b-form-checkbox>
          </b-col>
          <b-col md="6" class="text-left">
              <b-form-checkbox id="checkboxDinner"
                     v-model="form.askDinner"
                     >
                     Ask Users Dinner Selection
              </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" class="text-left">
              <b-form-checkbox id="checkboxCME"
                     v-model="form.askCME"
                     >
                     Ask Users if they need CME credit
              </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6" class="text-left">
              <b-form-checkbox id="checkboxPosterSpecifics"
                     v-model="form.askPosterSpecifics"
                     >
                     Ask Users if they will submit a poster abstract
              </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="8" class="text-left">
              <b-form-checkbox id="checkboxPosterJudging"
                     v-model="form.askPosterJudging"
                     >
                     Ask Users if they are interested in judging posters for this event
              </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="8" class="text-left">
              <b-form-checkbox id="checkboxSpecialNeeds"
                     v-model="form.askSpecialNeeds"
                     >
                     Ask Users if they have any special considerations
              </b-form-checkbox>
          </b-col>
        </b-row>
      <div slot="modal-footer">
          <b-button type="reset" variant="secondary">Cancel</b-button>
          <b-button type="cancel" variant="primary">Submit</b-button>
       </div>
    </b-modal>
    </b-form>
</b-container>
</template>

<script>
import { db, storage } from '../main'

export default {
  name: 'MyConferences',
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    userProfile () {
      return this.$store.getters.getUserProfile
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
      myAdminConferences: [],
      formOptions: {},
      onValidated: '',
      myConferences: [],
      progressUpload: 0,
      file: File,
      uploadTask: '',
      downloadURL: '',
      form: [],
      show: true,
      conference: [],
      registrantFields: [
        { key: 'displayName', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'institution', label: 'Institution' },
        { key: 'actions', label: 'Actions' }
      ],
      fields: [
        { key: 'conference.title', label: 'Title', sortable: true },
        { key: 'conference.description', label: 'Summary' },
        { key: 'conference.startDateTime', label: 'Conference Start' },
        { key: 'actions', label: 'Actions' }
      ],
      filter: null,
      conferenceStatus: true,
      modalConferenceId: '',
      registrants: [],
      editingConference: '',
      registrationId: '',
      conferenceDetails: {},
      model: {
        posterSubmissionAbstract: '',
        specialNeeds: '',
        posterSubmissionTitle: '',
        conference: {}
      }
    }
  },
  firestore () {
    return {
      myConferences: db.collection('Registrations').where('userId', '==', this.$store.getters.getUser.uid).orderBy('conference.startDateTime')
    }
  },
  methods: {
    resetRegistrants () {
      this.registrants = []
    },
    removeUser (userId, conferenceId) {
      db.collection('Registrations').where('userId', '==', userId).where('conference.Id', '==', conferenceId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            db.collection('Registrations').doc(doc.id).delete().then(x => {
              console.log('Document successfully deleted!')
              var batch = db.batch()
              var conferenceDocRef = db.collection('Conferences').doc(conferenceId)
              return db.runTransaction(transaction => {
                return transaction.get(conferenceDocRef).then(conferenceDoc => {
                  if (!conferenceDoc.exists) {
                    throw new Error('Document does not exist!')
                  }
                  var newRegistrantCount = (conferenceDoc.data().registrants || 0) - 1
                  batch.update(conferenceDocRef, {registrants: newRegistrantCount})
                  if (doc.data().lunchSelection) {
                    var lunchUpdate = 'lunchesNeeded.' + doc.data().lunchSelection
                    var newLunchCount = (conferenceDoc.data().lunchesNeeded[doc.data().lunchSelection] || 0) - 1
                    batch.update(conferenceDocRef, {[lunchUpdate]: newLunchCount})
                  }
                  if (doc.data().dinnerSelection) {
                    var dinnerUpdate = 'dinnersNeeded.' + doc.data().dinnerSelection
                    var newDinnerCount = (conferenceDoc.data().dinnersNeeded[doc.data().dinnerSelection] || 0) - 1
                    batch.update(conferenceDocRef, {[dinnerUpdate]: newDinnerCount})
                  }
                  if (doc.data().tShirtSize) {
                    var tShirtUpdate = 'tShirtsNeeded.' + doc.data().tShirtSize
                    var newTShirtCount = (conferenceDoc.data().tShirtsNeeded[doc.data().tShirtSize] || 0) - 1
                    batch.update(conferenceDocRef, {[tShirtUpdate]: newTShirtCount})
                  }
                  batch.commit().then(x => {
                    this.registrants = this.registrants.filter(function (obj) {
                      return obj.uid !== userId
                    })
                  })
                })
              }).then(function () {
                console.log('Transaction successfully committed!')
                this.$router.replace('/myconferences')
              }).catch(function (error) {
                console.log('Transaction failed: ', error)
              })
            }).catch(function (error) {
              console.error('Error removing document: ', error)
            })
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    setConference (conferenceId) {
      db.collection('Registrations').where('userId', '==', this.$store.getters.getUser.uid).where('conference.Id', '==', conferenceId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.model = doc.data()
            this.registrationId = doc.id
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
    },
    setStatus (conferenceId) {
      var docRef = db.collection('Conferences').doc(conferenceId)
      docRef.get().then(doc => {
        this.form = doc.data()
        this.modalConferenceId = conferenceId
      }).catch(function (error) {
        console.log('Error getting document: ', error)
      })
    },
    setAtendeeDetails (conferenceId) {
      var docRef = db.collection('Conferences').doc(conferenceId)
      docRef.get().then(doc => {
        this.conferenceDetails = doc.data()
      }).catch(function (error) {
        console.log('Error getting document: ', error)
      })
    },
    setRegistrants (conferenceId) {
      db.collection('Registrations').where('conference.Id', '==', conferenceId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var docRef = db.collection('metadata').doc(doc.data().userId)
            docRef.get().then(doc => {
              if (doc.exists) {
                this.registrants.push(doc.data())
              } else {
                // doc.data() will be undefined in this case
                console.log('No such document!')
              }
            }).catch(function (error) {
              console.log('Error getting document: ', error)
            })
          })
        })
        .catch(function (error) {
          console.log('Error getting documents: ', error)
        })
      this.editingConference = conferenceId
    },
    onEventSubmit (evt) {
      var docRef = db.collection('Registrations').doc(this.registrationId)
      if (this.model.posterSubmission !== 'I WILL submit an abstract and will enter it now') {
        this.model.posterSubmissionCategory = ''
        this.model.posterSubmissionTitle = ''
        this.model.posterSubmissionAbstract = ''
      }
      return db.runTransaction(transaction => {
        return transaction.get(docRef).then(doc => {
          if (!doc.exists) {
            throw new Error('Document does not exist!')
          }
          transaction.update(docRef, this.model)
          var batch = db.batch()
          var conferenceDocRef = db.collection('Conferences').doc(doc.data().conference.Id)
          return db.runTransaction(transaction => {
            return transaction.get(conferenceDocRef).then(conferenceDoc => {
              if (!conferenceDoc.exists) {
                throw new Error('Document does not exist!')
              }
              if (doc.data().lunchSelection && (this.model.lunchSelection !== doc.data().lunchSelection)) {
                var lunchRemove = 'lunchesNeeded.' + doc.data().lunchSelection
                var newLunchRemoveCount = (conferenceDoc.data().lunchesNeeded[doc.data().lunchSelection] || 0) - 1
                var lunchUpdate = 'lunchesNeeded.' + this.model.lunchSelection
                var newLunchCount = (conferenceDoc.data().lunchesNeeded[this.model.lunchSelection] || 0) + 1
                batch.update(conferenceDocRef, {
                  [lunchUpdate]: newLunchCount,
                  [lunchRemove]: newLunchRemoveCount
                })
              }
              if (doc.data().dinnerSelection && (this.model.dinnerSelection !== doc.data().dinnerSelection)) {
                var dinnerRemove = 'dinnersNeeded.' + doc.data().dinnerSelection
                var newDinnerRemoveCount = (conferenceDoc.data().dinnersNeeded[doc.data().dinnerSelection] || 0) - 1
                var dinnerUpdate = 'dinnersNeeded.' + this.model.dinnerSelection
                var newDinnerCount = (conferenceDoc.data().dinnersNeeded[this.model.dinnerSelection] || 0) + 1
                batch.update(conferenceDocRef, {
                  [dinnerUpdate]: newDinnerCount,
                  [dinnerRemove]: newDinnerRemoveCount
                })
              }
              if (doc.data().tShirtSize && (this.model.tShirtSize !== doc.data().tShirtSize)) {
                var tShirtRemove = 'tShirtsNeeded.' + doc.data().tShirtSize
                var newTShirtRemoveCount = (conferenceDoc.data().tShirtsNeeded[doc.data().tShirtSize] || 0) - 1
                var tShirtUpdate = 'tShirtsNeeded.' + this.model.tShirtSize
                var newTShirtCount = (conferenceDoc.data().tShirtsNeeded[this.model.tShirtSize] || 0) + 1
                batch.update(conferenceDocRef, {
                  [tShirtUpdate]: newTShirtCount,
                  [tShirtRemove]: newTShirtRemoveCount
                })
              }
              batch.commit().then(function () {})
            })
          }).then(function () {
            console.log('Transaction successfully committed!')
          }).catch(function (error) {
            console.log('Transaction failed: ', error)
          })
        })
      }).then(function () {
        console.log('Transaction successfully committed!')
      }).catch(function (error) {
        console.log('Transaction failed: ', error)
      })
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.form.Id = this.modalConferenceId
      this.form.startDateTime = new Date(this.form.startDate + ' ' + this.form.startTime)
      this.form.endDateTime = new Date(this.form.endDate + ' ' + this.form.endTime)
      this.form.registrationDateTime = new Date(this.form.registrationDeadlineDate + ' ' + this.form.registrationDeadlineTime)
      var modalSubmit = this.form
      var docRef = db.collection('Conferences').doc(this.modalConferenceId)
      return db.runTransaction(function (transaction) {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(docRef).then(Doc => {
          if (!Doc.exists) {
            throw new Error('Document does not exist!')
          }
          transaction.update(docRef, modalSubmit)
        })
      }).then(docs => {
        console.log('Transaction successfully committed!')
        db.collection('Registrations').where('conference.Id', '==', this.modalConferenceId)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(function (doc) {
              // Create a reference to the SF doc.
              var docRef = db.collection('Registrations').doc(doc.id)
              db.runTransaction(function (transaction) {
                return transaction.get(docRef).then(doc => {
                  if (!doc.exists) {
                    throw new Error('Document does not exist!')
                  }
                  delete modalSubmit.schema
                  transaction.update(docRef, { conference: modalSubmit })
                })
              }).then(function () {
                console.log('Transaction successfully committed!')
              }).catch(function (error) {
                console.log('Transaction failed: ', error)
              })
            })
          })
          .catch(function (error) {
            console.log('Error getting documents: ', error)
          })
        this.form = {}
        this.$refs.editConference.hide()
      }).catch(function (error) {
        console.log('Transaction failed: ', error)
      })
    },
    onCancel () {
      this.$refs.editConference.hide()
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form = {}
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
      this.$refs.editConference.hide()
    },
    detectFiles (fileList) {
      Array.from(Array(fileList.length).keys()).map(x => {
        this.upload(fileList[x])
      })
    },
    upload (file) {
      if (this.imageName != null) {
        var imageRef = storage.ref().child('images/' + this.imageName)
        imageRef.delete().then(function () {
      }).catch(function (error) {
        console.log('Error removing file')
      })
      }
      this.uploadTask = storage.ref('images/' + file.name).put(file)
      this.uploadTask.then(snapshot => {
        this.imageName = this.uploadTask.snapshot.metadata.name
        this.downloadURL = this.uploadTask.snapshot.downloadURL
        this.$emit('url', this.downloadURL)
        this.form.logoURL = this.downloadURL
        this.form.logoName = this.uploadTask.snapshot.metadata.name
      })
    }
  },
  watch: {
    uploadTask: function () {
      this.uploadTask.on('state_changed', sp => {
        this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      })
    }
  },
  beforeMount () {
    if (this.userProfile.departmentManagement.length > 0) {
      this.userProfile.departmentManagement.forEach(element => {
        db.collection('Conferences').where('department', '==', element.value)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              var adminConference = doc.data()
              delete adminConference.schema
              adminConference.Id = doc.id
              // doc.data() is never undefined for query doc snapshots
              this.myConferences.push({
                userId: '',
                conference: adminConference,
                isAdmin: true
              })
            })
          })
          .catch(function (error) {
            console.log('Error getting documents: ', error)
          })
      })
    }
  }
}
</script>
<style scoped>
.b-form-group, .vue-form-generator {
  text-align: left;
}
.btn {
  border-radius: 0px;
}
.modal-row-space {
  margin-bottom: 15px;
}
.form-row-margin {
  margin-bottom: 15px;
}
</style>
