<template>
  <div class="main-holdd">
    <q-dialog v-model="phonedialog">
      <q-card>
        <div class="dialogmain">
          <q-toolbar class="toolbar-holder">
            <p class="phone-txt">Phone</p>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <div class="radio-holder">
            <p class="category-txt">Category</p>
            <div class="radio-class">
              <q-radio
                dense
                v-model="type"
                val="Mobile"
                label="Mobile"
                class="radio-1"
              />
              <q-radio
                dense
                v-model="type"
                val="Home"
                label="Home"
                class="radio-1"
              />
              <q-radio
                dense
                v-model="type"
                val="Company"
                label="Company"
                class="radio-2"
              />
              <q-radio
                dense
                v-model="type"
                val="Fax"
                label="Fax"
                class="radio-2"
              />
              <q-radio
                dense
                v-model="type"
                val="Other"
                label="Other"
                class="radio-2"
              />
            </div>
            <div class="field-holderr">
              <p class="category-txt">Phone Number</p>
              <div class="col">
                <q-input
                  outlined
                  v-model="phoneNumber"
                  label="Outlined"
                  dense
                  class="input-individual"
                />
              </div>
            </div>
            <div class="field-holderr">
              <p class="category-txt">Extension</p>
              <div class="col">
                <q-input
                  outlined
                  v-model="extension"
                  label="Outlined"
                  dense
                  class="input-individual"
                />
              </div>
            </div>
            <div class="field-holderr">
              <p class="category-txt">Remarks</p>
              <div class="col">
                <q-input
                  outlined
                  v-model="remarks"
                  label="Outlined"
                  dense
                  class="input-individual"
                />
              </div>
            </div>
            <div class="lowerdialog-btn">
              <q-btn
                color="primary"
                label="Save"
                v-close-popup
                @click="addPhone"
              />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="emaildialog">
      <q-card class="cardwidth">
        <div class="dialogmain">
          <q-toolbar class="toolbar-holder">
            <p class="phone-txt">Email</p>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <div class="radio-holder">
            <p class="category-txt">Type</p>
            <div class="radio-class">
              <q-radio
                dense
                v-model="type"
                val="home"
                label="Home"
                class="radio-1"
              />
              <q-radio
                dense
                v-model="type"
                val="company"
                label="Work"
                class="radio-2"
              />
            </div>
            <div class="field-holderr">
              <p class="category-txt">Email Address</p>
              <div>
                <q-input
                  outlined
                  v-model="text"
                  label="Outlined"
                  dense
                  class="input-individuall"
                />
              </div>
            </div>

            <div class="field-holderr">
              <p class="category-txt">Remarks</p>
              <div>
                <q-input
                  outlined
                  v-model="text"
                  label="Outlined"
                  dense
                  class="input-individuall"
                />
              </div>
            </div>
            <div class="lowerdialog-btn">
              <q-btn color="primary" label="Save" v-close-popup />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addressdialog">
      <q-card>
        <div class="dialogmain">
          <q-toolbar class="toolbar-holder">
            <p class="phone-txt">Address</p>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <div class="radio-holder">
            <p class="category-txt">Type</p>
            <div class="radio-class">
              <q-radio
                dense
                v-model="type"
                val="home"
                label="Home"
                class="radio-1"
              />
              <q-radio
                dense
                v-model="type"
                val="company"
                label="Company"
                class="radio-2"
              />
              <q-radio
                dense
                v-model="type"
                val="fax"
                label="Fax"
                class="radio-2"
              />
              <q-radio
                dense
                v-model="type"
                val="other"
                label="Other"
                class="radio-2"
              />
            </div>
            <div class="field-holderr">
              <div class="rowdialog">
                <div class="col-4">
                  <p class="category-txt">Home</p>
                  <q-input
                    outlined
                    v-model="text"
                    label="Outlined"
                    dense
                    class="input-individual"
                  />
                </div>
                <div class="col-4">
                  <p class="category-txt">Country Code</p>
                  <q-input
                    outlined
                    v-model="text"
                    label="Outlined"
                    dense
                    class="input-individual"
                  />
                </div>
              </div>
              <div class="rowdialog">
                <div class="col-4">
                  <div class="field-holderr">
                    <p class="category-txt">Zip</p>
                    <q-input
                      outlined
                      v-model="text"
                      label="Outlined"
                      dense
                      class="input-individual"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="field-holderr">
                    <p class="category-txt">City</p>
                    <q-input
                      outlined
                      v-model="text"
                      label="Outlined"
                      dense
                      class="input-individual"
                    />
                  </div>
                </div>
              </div>
              <div class="rowdialog">
                <div class="col-4">
                  <div class="field-holderr">
                    <p class="category-txt">State/Province</p>
                    <q-input
                      outlined
                      v-model="text"
                      label="Outlined"
                      dense
                      class="input-individual"
                    />
                  </div>
                </div>
                <div class="col-4">
                  <div class="field-holderr">
                    <p class="category-txt">Street</p>
                    <q-input
                      outlined
                      v-model="text"
                      label="Outlined"
                      dense
                      class="input-individual"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="field-holderr">
              <p class="category-txt">Remarks</p>
              <div class="col">
                <q-input
                  outlined
                  v-model="text"
                  label="Outlined"
                  dense
                  class="input-individual"
                />
              </div>
            </div>

            <div class="lowerdialog-btn">
              <q-btn color="primary" label="Save" v-close-popup />
            </div>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="mediadialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Close icon</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
          repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis
          perferendis totam, ea at omnis vel numquam exercitationem aut, natus
          minima, porro labore.
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="sub-hold">
      <div class="row">
        <div class="col-3">
          <div class="row-main">
            <div>
              <div
                :class="
                  selectedtab === 'Phone' ? 'sidebar-row-active' : 'sidebar-row'
                "
                @click="handleclick('Phone')"
              >
                <img
                  src="../../assets/images/phonewhite.png"
                  v-if="selectedtab === 'Phone'"
                />
                <img
                  src="../../assets/images/phone.png"
                  v-if="selectedtab !== 'Phone'"
                />

                <p
                  :class="
                    selectedtab === 'Phone'
                      ? 'sidebar-subtext-active'
                      : 'sidebar-subtext'
                  "
                >
                  Phone
                </p>
              </div>
            </div>

            <div>
              <div
                :class="
                  selectedtab === 'Address'
                    ? 'sidebar-row-active'
                    : 'sidebar-row'
                "
                @click="handleclick('Address')"
              >
                <img
                  src="../../assets/images/addresswhite.png"
                  v-if="selectedtab === 'Address'"
                />
                <img
                  src="../../assets/images/address.png"
                  v-if="selectedtab !== 'Address'"
                />
                <p
                  :class="
                    selectedtab === 'Address'
                      ? 'sidebar-subtext-active'
                      : 'sidebar-subtext'
                  "
                >
                  Address
                </p>
              </div>
            </div>

            <div>
              <div
                :class="
                  selectedtab === 'Email' ? 'sidebar-row-active' : 'sidebar-row'
                "
                @click="handleclick('Email')"
              >
                <img
                  src="../../assets/images/emailwhite.png"
                  v-if="selectedtab === 'Email'"
                />
                <img
                  src="../../assets/images/email.png"
                  v-if="selectedtab !== 'Email'"
                />
                <p
                  :class="
                    selectedtab === 'Email'
                      ? 'sidebar-subtext-active'
                      : 'sidebar-subtext'
                  "
                >
                  Email
                </p>
              </div>
            </div>

            <div>
              <div
                :class="
                  selectedtab === 'Media' ? 'sidebar-row-active' : 'sidebar-row'
                "
                @click="handleclick('Media')"
              >
                <img
                  src="../../assets/images/sideprofile.png"
                  v-if="selectedtab === 'Media'"
                />
                <img
                  src="../../assets/images/sideprofile.png"
                  v-if="selectedtab !== 'Media'"
                />
                <p
                  :class="
                    selectedtab === 'Media'
                      ? 'sidebar-subtext-active'
                      : 'sidebar-subtext'
                  "
                >
                  Social media
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-8" style="margin-left: 10px">
          <div>
            <div class="row justify-between">
              <q-input outlined v-model="text" dense>
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
              <q-btn
                v-if="
                  customerStore.customer.contacts && selectedtab === 'Phone'
                "
                style="background: #4b44f6; color: white"
                label="+ Add"
                @click="phonedialog = true"
              />
            </div>
            <div
              v-if="customerStore.customer.contacts && selectedtab === 'Phone'"
              class="row q-col-gutter-md"
            >
              <div
                v-for="(contact, index) in customerStore.customer.contacts"
                :key="index"
              >
                <contact-phone-card
                  :phone-number="contact.contacts_id.phone_number"
                  :remarks="`This is ${contact.contacts_id.remarks} number`"
                  @edit="phonedialog = true"
                />
              </div>
            </div>
            <div v-else class="row justify-center">
              <div>
                <div>
                  <img src="../../assets/images/otherinfomain.png" />

                  <p class="bottom-textmainn">No {{ selectedtab }}</p>
                </div>
                <p v-if="selectedtab === 'Phone'" class="bottom-textsubb">
                  {{ phonetxt }}
                </p>
                <p v-if="selectedtab === 'Email'" class="bottom-textsubb">
                  {{ emailtxt }}
                </p>
                <p v-if="selectedtab === 'Address'" class="bottom-textsubb">
                  {{ addresstxt }}
                </p>
                <p v-if="selectedtab === 'Media'" class="bottom-textsubb">
                  {{ mediatxt }}
                </p>

                <q-btn
                  v-if="selectedtab === 'Phone'"
                  color="primary"
                  label="+   New "
                  @click="phonedialog = true"
                  class="modal-btn"
                />
                <q-btn
                  v-if="selectedtab === 'Email'"
                  color="primary"
                  label="+   New "
                  @click="emaildialog = true"
                  class="modal-btn"
                />
                <q-btn
                  v-if="selectedtab === 'Address'"
                  color="primary"
                  label="+   New "
                  @click="addressdialog = true"
                  class="modal-btn"
                />
                <q-btn
                  v-if="selectedtab === 'Media'"
                  color="primary"
                  label="+   New "
                  @click="mediadialog = true"
                  class="modal-btn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import "./ContactInfo.scss";
import "vue3-tel-input/dist/vue3-tel-input.css";
import ContactPhoneCard from "../Customer/ContactPhoneCard.vue";
import { useRoute } from "vue-router";
import useCustomerStore from "src/stores/modules/customer";

const route = useRoute();
const customerStore = useCustomerStore();

const phonedialog = ref(false);
const phoneNumber = ref("");
const extension = ref("");
const remarks = ref("");

const type = ref("");
const text = ref("");
const selectedtab = ref("Phone");
const phonetxt = ref("Click the button to add the first call");
const emailtxt = ref("Click the button below to add Email information.");
const addresstxt = ref("Click the button below to add address information.");
const mediatxt = ref(
  "You can add up to 10 files, videos,photos and other attachments to each , record and the maximum size of eachattached file is 10 MB"
);

const handleclick = (data) => {
  selectedtab.value = data;
};

const addPhone = async () => {
  const customerId = route.params.id;
  const params = {
    category: type.value,
    phone_number: phoneNumber.value,
    extension: extension.value,
    remarks: remarks.value,
  };
  const result = await customerStore.addContact(customerId, params);
  console.log(result);
};
</script>

<style lang="sass" scoped>

.row>div.col-3
  padding: 10px 15px
  background: white
  border-right: 1px solid rgba(86,61,124,.2)
.row + .row
  margin-top: 1rem
</style>
