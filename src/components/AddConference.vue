<template>
    <b-container>
      <h1>Create New Conference</h1>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
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
                                label="Logo"
                                label-for="conferenceLogoInput">
                    <b-form-file v-model="file" ref="fileinput" required accept="image/*" :state="Boolean(file)" placeholder="Choose a file..." @change="detectFiles($event.target.files)"></b-form-file>
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
                <b-form-group id="conferenceDepartmentInputGroup"
                                label="Choose a Department"
                                label-for="conferenceDepartmentInput">
                    <b-form-select v-model="form.department" :options="departmentOptions.departmentManagement" class="mb-3" />
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
                                :state="dateState"
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
                                :state="dateState"
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
          <b-col md="3" class="text-left">
              <b-form-checkbox id="checkboxTshirt"
                     v-model="form.askTShirt"
                     >
                     Ask Users T-Shirt Size
              </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4" class="text-left">
              <b-form-checkbox id="checkboxLunch"
                     v-model="form.askLunch"
                     >
                     Ask Users Lunch Selection
              </b-form-checkbox>
          </b-col>
          <b-col md="4" class="text-left">
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
        <!-- <b-row>
            <b-col md="7">
                <b-form-group id="addtionalInputGroup"
                    label="If you would like to add additional questions please specify the number here:"
                    label-for="additionalInput"
                >
                <b-form-input id="additionalInput"
                      type="number"
                      v-model="additionalItems"
                      placeholder="How many more questions"
                      v-on:input="changeNum()"
                      >
                </b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <div v-for="n in extraQuestions.length" :key="n" class="extra-question">
        <div v-if="extraQuestions[n-1]">
          <b-row>
            <h4>{{extraQuestions[n-1].label || "Question Name"}}</h4>
          </b-row>
          <b-row>
            <b-col md="6">
                <b-form-select required v-model="extraQuestions[n-1].type" :options="options" class="mb-3" />
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-input id="additionalInput"
                            type="text"
                            v-on:input="bindModel(n)"
                            v-model="extraQuestions[n-1].label"
                            placeholder="Please add a label for your question"
                            required
              >
              </b-form-input>
            </b-col>
            <b-col md="6" v-if="extraQuestions[n-1].type === 'input'">
              <b-form-select required v-model="extraQuestions[n-1].inputType" :options="inputTypeOptions" class="mb-3" />
            </b-col>
          </b-row>
        </div>
        </div> -->
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </b-container>
</template>

<script>
import { db, storage } from '../main'

export default {
  name: 'AddConference',
  computed: {
    dateState () {
      return this.form.endDate === '' ? null : (new Date(this.form.endDate)) >= (new Date(this.form.startDate)) ? true : false
    },
    user () {
      return this.$store.getters.getUser
    }
  },
  firestore () {
    return {
      departmentOptions: db.collection('metadata').doc(this.$store.getters.getUser.uid)
    }
  },
  data () {
    return {
      selected: null,
      departmentOptions: [],
      options: [
        {value: {type: null, inputType: null, label: ''}, text: 'Please select a question type'},
        {value: 'input', text: 'Text Field'},
        {value: 'checkbox', text: 'Checkboxes'},
        {value: 'radio', text: 'Radio Buttons'}
      ],
      inputTypeOptions: [
        {value: null, text: 'Please select a question type'},
        {value: 'text', text: 'Text'},
        {value: 'number', text: 'Number'}
      ],
      additionalItems: 0,
      progressUpload: 0,
      file: File,
      uploadTask: '',
      downloadURL: '',
      extraQuestions: [],
      form: {
        lunchesNeeded: {
          Beef: 0,
          Chicken: 0,
          Fish: 0,
          Vegetarian: 0,
          'No Lunch Requested': 0
        },
        dinnersNeeded: {
          Beef: 0,
          Chicken: 0,
          Fish: 0,
          Vegetarian: 0,
          'No Dinner Requested': 0
        },
        tShirtsNeeded: {
          Small: 0,
          Medium: 0,
          Large: 0,
          XL: 0,
          XXL: 0,
          'No Shirt Requested': 0
        },
        schema: {
          fields: []
        },
        title: '',
        logoURL: '',
        description: '',
        startDate: '',
        startTime: '',
        startDateTime: '',
        endDate: '',
        endTime: '',
        endDateTime: '',
        registrationDeadlineDate: '',
        registrationDeadlineTime: '',
        registrationDateTime: '',
        createdAt: ''
      },
      show: true
    }
  },
  methods: {
    bindModel (n) {
      this.extraQuestions[n - 1].model = this.extraQuestions[n - 1].label
    },
    changeNum () {
      if (this.additionalItems < this.extraQuestions.length) {
        var removeItem = this.extraQuestions.slice(0, this.additionalItems)
        this.extraQuestions = removeItem
      } else {
        var i
        for (i = this.extraQuestions.length; i < this.additionalItems; i++) {
          this.extraQuestions.push({
            type: null,
            inputType: null,
            label: ''
          })
        }
      }
      return this.extraQuestions
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
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.form.createdAt = new Date()
      this.form.startDateTime = new Date(this.form.startDate + ' ' + this.form.startTime)
      this.form.endDateTime = new Date(this.form.endDate + ' ' + this.form.endTime)
      this.form.registrationDateTime = new Date(this.form.registrationDeadlineDate + ' ' + this.form.registrationDeadlineTime)
      // this.form.schema.fields = this.posterSpecifics
      // this.form.schema.fields.sort(function (a, b) { return (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0) })
      // this.form.schema.fields = this.form.schema.fields.concat(this.extraQuestions)
      var conferenceInfo = {}
      conferenceInfo.conference = this.form
      db.collection('Conferences').add(this.form)
        .then(docRef => {
          // delete conferenceInfo.conference.schema
          delete conferenceInfo.conference.adminId
          conferenceInfo.adminId = this.$store.getters.getUser.uid
          conferenceInfo.userId = this.$store.getters.getUser.uid
          conferenceInfo.conference.Id = docRef.id
          alert('Conference successfully added')
          this.$router.replace('/myconferences')
        })
        .catch(function (error) {
          console.error('Error adding document: ', error)
        })
      // this.extraQuestions = {
      //   schema: {
      //     fields: [
      //     ]
      //   }
      // }
      this.form = {
        title: '',
        logoURL: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        registrationDeadlineDate: '',
        registrationDeadlineTime: ''
      }
      this.progressUpload = 0
      this.$refs.fileinput.reset()
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form = []
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    }
  },
  watch: {
    uploadTask: function () {
      this.uploadTask.on('state_changed', sp => {
        this.progressUpload = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      })
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 15px;
}
.b-form-group {
  text-align: left;
}
.btn {
  border-radius: 0px;
}
.extra-question {
  margin-bottom: 15px;
}
</style>
