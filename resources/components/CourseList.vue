<template>
  <a-collapse>
    <a-collapse-panel
      v-for="course in data"
      :header="course.name"
      :extra="
        $createElement('a-rate', {
          props: {
            disabled: true,
            defaultValue: getRate(course.id),
            allowHalf: true
          }
        })
      "
      :key="course.id"
      ><div v-html="course.desc"></div>
      <a-tabs>
        <a-tab-pane tab="Отзывы" key="1">
          <a-list
            bordered
            :dataSource="$store.state.courses.find(el => el.id === course.id).feedbacks"
          >
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-list-item-meta :description="item.feedback">
                {{ item.feedback }}
                <div slot="title">
                  <a-rate
                    allowHalf
                    disabled
                    :defaultValue="item.overall_rate / 2"
                  ></a-rate>
                </div>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-tab-pane>
        <a-tab-pane
          v-if="$store.state.mycourses.includes(course.id) &&
          ['student'].includes($store.state.userrole)"
          tab="Оставить отзыв"
          key="2"
        >
          <div
            v-if="
              !$store.state.courses.find(el => el.id === course.id).feedbacks.find(
                el => el.user_id == $store.state.uid
              )
            "
          >
            <div>Интресность материала:</div>
            <a-rate allowHalf v-model="interest_value" />
            <span class="ant-rate-text">{{
              interest[Math.round(interest_value - 1)]
            }}</span
            ><br />
            <div>Понятность материала:</div>
            <a-rate allowHalf v-model="lucidity_value" />
            <span class="ant-rate-text">{{
              lucidity[Math.round(lucidity_value - 1)]
            }}</span
            ><br />
            <div>Пратическая полезность:</div>
            <a-rate allowHalf v-model="utility_value" />
            <span class="ant-rate-text">{{
              utility[Math.round(utility_value - 1)]
            }}</span
            ><br />
            <a-textarea :ref="`a${course.id}`" class="feedback-submit" />
            <a-button
              @click="feedbackSubmit(`a${course.id}`)"
              class="feedback-submit"
              >Отправить</a-button
            >
          </div>
          <div
            v-else
            :style="{
              fontSize: '30px',
              color: '#1b72ba',
              'text-align': 'center'
            }"
          >
            <a-icon type="check" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import Vue from "vue";

import {
  Tabs,
  Collapse,
  Rate,
  Input,
  Button,
  Icon,
  List
} from "ant-design-vue";
import "ant-design-vue/lib/tabs/style/css";
import "ant-design-vue/lib/collapse/style/css";
import "ant-design-vue/lib/rate/style/css";
import "ant-design-vue/lib/input/style/css";
import "ant-design-vue/lib/button/style/css";
import "ant-design-vue/lib/icon/style/css";
import "ant-design-vue/lib/list/style/css";
Vue.use(Tabs);
Vue.use(Collapse);
Vue.use(Rate);
Vue.use(Input);
Vue.use(Button);
Vue.use(Icon);
Vue.use(List);
export default {
  props: ["data"],
  data() {
    return {
      interest_value: 0,
      lucidity_value: 0,
      utility_value: 0,
      interest: [
        "Совсем не интересно",
        "Не интересно",
        "Достаточно интересно",
        "Интересно",
        "Очень интересно"
      ],
      lucidity: [
        "Совсем не понятно",
        "Большинство не понятно",
        "Достаточно понятно",
        "Большинство понятно",
        "Всё понятно"
      ],
      utility: [
        "Совсем бесполезно",
        "Почти всё бесполезно",
        "50 на 50",
        "Почти всё полезно",
        "Очень полезно"
      ]
    };
  },
  methods: {
    getRate(courseid) {
      const count = this.$store.state.courses.find(el => el.id === courseid).feedbacks.length;
      if (count === 0) return 0;
      const sum = this.$store.state.courses.find(el => el.id === courseid).feedbacks.reduce(
        (ac, c) => ac + c.overall_rate,
        0
      );
      return Math.round(sum / count) / 2;
    },
    async feedbackSubmit(id) {
      let _id = id.slice(1);
      await this.$store.dispatch("сourseFeedback", {
        id: _id,
        overall_rate: Math.round(
          ((this.interest_value + this.lucidity_value + this.utility_value) /
            3) *
            2
        ),
        feedback: this.$refs[id][0].$el.value
      });
    }
  }
};
</script>

<style>
.feedback-submit {
  margin-top: 13px;
}
</style>
