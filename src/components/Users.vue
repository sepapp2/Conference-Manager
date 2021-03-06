<template>
  <div class="products">
    <b-container fluid>
      <!-- User Interface controls -->
      <b-row>
        <b-col md="6" offset-md="3">
          <b-table striped
                   hover
                   :items="users"
                   :fields="fields"
          >
          <template slot="admin" v-if="userProfile.canChangeRole" slot-scope="item">
            <b-form-select v-model="item.item.admin" :options="adminOptions" class="mb-3 select-table-row" @change="changeRole(item.item)"/>
          </template>
          <template slot="actions" slot-scope="item" v-if="userProfile.canEditProfile">
            <b-button size="sm" variant="default" class="mr-1" @click="editUser(item.item)" v-b-modal.editUser>
              Edit User
            </b-button>
          </template>
          </b-table>
        </b-col>
      </b-row>
      <b-form>
            <b-modal  id="editUser"
              size="lg"
              ref="editUser"
              title="Edit User Profile"
              v-if="userProfile.canEditProfile"
              @ok="onSubmit"
              @cancel="onReset"
              ok-title="Submit">
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="5">
              <input class="form-control" type="text" required v-model="userInfo.firstName" placeholder="First Name">
            </b-col>
            <b-col sm="12" md="2">
              <input class="form-control" type="text" v-model="userInfo.middleName" placeholder="Middle Initial">
            </b-col>
            <b-col sm="12" md="5">
              <input class="form-control" type="text" required v-model="userInfo.lastName" placeholder="Last Name">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="12">
              <b-form-group label="Please select all applicable credentials">
                <b-form-checkbox-group id="credentials" name="credentials" v-model="userInfo.credentials" :options="credentialOptions">
                </b-form-checkbox-group>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="6">
              <div>
                <b-form-select v-model="userInfo.institution" :options="institutions" class="mb-3" size="lg" />
              </div>
            </b-col>
            <b-col sm="12" md="6">
              <input class="form-control" type="text" v-model="userInfo.institution" placeholder="Or enter Institution here if not in dropdown">
            </b-col>
          </b-row>
          <b-row class="text-center">
            <b-col sm="12" md="6">
              <div>
                <b-form-select multiple :select-size="6" v-if="userProfile.canAssignDepartments" v-model="userInfo.departmentManagement" :options="departmentOptions" size="lg" />
              </div>
            </b-col>
          </b-row>
          <b-row class="text-center">
            <b-col sm="12" md="6">
              <input class="form-control" type="text" required v-model="userInfo.address" placeholder="Address Line 1">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="6">
              <input class="form-control" type="text" required v-model="userInfo.address2" placeholder="Address Line 2">
            </b-col>
            <b-col sm="12" md="6">
              <input class="form-control" type="tel" pattern="^\d{3}-\d{3}-\d{4}$" required v-model="userInfo.phone" placeholder="Phone Number format 'xxx-xxx-xxxx'">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col sm="12" md="5">
              <input class="form-control" type="text" required v-model="userInfo.city" placeholder="City">
            </b-col>
            <b-col sm="12" md="3">
              <div>
                <b-form-select v-model="userInfo.state" :options="states" class="mb-3" size="lg" />
              </div>
            </b-col>
            <b-col sm="12" md="4">
              <input class="form-control" type="text" required v-model="userInfo.zip" pattern="[0-9]{5}" placeholder="Zip">
            </b-col>
          </b-row>
          <b-row align-h="center" class="text-center">
            <b-col md="4" v-if="userProfile.admin">
              <b-form-checkbox class="inline-checkbox" v-model="userInfo.canEditProfile"/>User can Edit Other Profiles
            </b-col>
            <b-col md="4" v-if="userProfile.admin">
              <b-form-checkbox class="inline-checkbox" v-model="userInfo.canAssignDepartments"/>User can set up Department Delegates
            </b-col>
            <b-col md="4" v-if="userProfile.admin">
              <b-form-checkbox class="inline-checkbox" v-model="userInfo.canCreateConference"/>User can Create Conferences
            </b-col>
          </b-row>
          <!-- <b-row align-h="center" class="text-center">
            <b-col cols="12" sm="12" md="12">
              <input class="form-control" type="email" required v-model="userInfo.email" placeholder="Email">
            </b-col>
          </b-row> -->
          </b-modal>
        </b-form>
    </b-container>
  </div>
</template>

<script>
import { db } from '../main'
import firebase from 'firebase'

export default {
  name: 'Users',
  computed: {
    userProfile () {
      return this.$store.getters.getUserProfile
    }
  },
  data () {
    return {
      adminOptions: [
        { value: true, text: 'Admin' },
        { value: false, text: 'User' }
      ],
      institutions: [],
      departmentOptions: [],
      states: [],
      credentialOptions: [
        { value: null, text: 'None' },
        { value: 'MD', text: 'MD' },
        { value: 'PhD', text: 'PhD' },
        { value: 'MS', text: 'MS' },
        { value: 'RN', text: 'RN' },
        { value: 'PharmD', text: 'PharmD' },
        { value: 'DDS', text: 'DDS' },
        { value: 'DMD, ScD', text: 'DMD, ScD' },
        { value: 'DVM, PhD', text: 'DVM, PhD' },
        { value: 'D.Sc', text: 'D.Sc' },
        { value: 'DO', text: 'DO' },
        { value: 'Other', text: 'Other' }
      ],
      fields: {
        displayName: {
          label: 'User Name',
          sortable: true
        },
        email: {
          label: 'Email Address',
          sortable: true
        },
        admin: {
          label: 'Role',
          sortable: true
        },
        actions: {
          label: 'Actions',
          sortable: false
        }
      },
      users: [],
      userInfo: []
    }
  },
  firestore () {
    return {
      users: db.collection('metadata'),
      institutions: db.collection('Institutions').orderBy('id'),
      states: db.collection('States').orderBy('id'),
      departmentOptions: db.collection('Departments').orderBy('id')
    }
  },
  methods: {
    editUser (user) {
      var docRef = db.collection('metadata').doc(user.id)
      docRef.get().then(doc => {
        this.userInfo = doc.data()
      }).catch(function (error) {
        console.log('Error getting document: ', error)
      })
    },
    onSubmit (evt) {
      var userDocRef = db.collection('metadata').doc(this.userInfo.uid)
      this.userInfo.displayName = this.userInfo.firstName.trim() + ' ' + this.userInfo.lastName.trim()
      return db.runTransaction(transaction => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(userDocRef).then(userDoc => {
          if (!userDoc.exists) {
            throw new Error('Document does not exist!')
          }
          transaction.update(userDocRef, this.userInfo)
        })
      }).then(function () {
        this.userInfo = []
        console.log('Transaction successfully committed!')
      }).catch(function (error) {
        console.log('Transaction failed: ', error)
      })
    },
    onReset () {
      this.userInfo = []
    },
    changeRole (user) {
      if (user.id === firebase.auth().currentUser.uid) {
        alert('You cannot alter your own role')
      } else {
        var userDocRef = db.collection('metadata').doc(user.id)
        return db.runTransaction(function (transaction) {
          // This code may get re-run multiple times if there are conflicts.
          return transaction.get(userDocRef).then(function (userDoc) {
            if (!userDoc.exists) {
              throw new Error('Document does not exist!')
            }
            transaction.update(userDocRef, {
              admin: user.admin
            })
          })
        }).then(function () {
          console.log('Transaction successfully committed!')
        }).catch(function (error) {
          console.log('Transaction failed: ', error)
        })
      }
    }
  }
}
</script>

<style scoped>
input {
  margin: 10px 0;
  padding: 15px;
}
.form-control {
  border-radius: 0px;
}
span{
  display: block;
  margin-top: 20px;
  font-size: 11px;
}
.mb-3 {
  height: 3.5rem!important;
  margin-bottom: 0px!important;
  margin-top: 10px;
}
.select-table-row {
  height: inherit!important;
  margin-bottom: 0px!important;
  margin-top: 0px;
}
.inline-checkbox {
  padding-top: 5px;
}
</style>
