<template>
  <a-collapse>
    <a-collapse-panel
      v-for="scienceleader in data"
      :header="`${scienceleader.surname} ${scienceleader.name}`"
      :extra="
        ['admin'].includes($store.state.userrole)
          ? $createElement('a-rate', {
              props: {
                disabled: true,
                defaultValue: getRate(scienceleader.id),
                allowHalf: true
              }
            })
          : ''
      "
      :key="scienceleader.id"
      ><div v-html="scienceleader.desc"></div>
      <a-tabs>
        <a-tab-pane
          v-if="['admin'].includes($store.state.userrole)"
          tab="Отзывы"
          key="1"
        >
          <a-list
            bordered
            :dataSource="
              $store.state.scienceleaders.find(el => el.id === scienceleader.id)
                .feedbacks
            "
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
          v-if="
            $store.state.myscienceleaders.includes(scienceleader.id) &&
              ['student'].includes($store.state.userrole)
          "
          tab="Оставить отзыв"
          key="2"
        >
          <div
            v-if="
              !$store.state.scienceleaders
                .find(el => el.id === scienceleader.id)
                .feedbacks.find(el => el.user_id == $store.state.uid)
            "
          >
            <div>Уровень квалификации:</div>
            <a-rate allowHalf v-model="interest_value" />
            <span class="ant-rate-text">{{
              interest[Math.round(interest_value - 1)]
            }}</span
            ><br />
            <a-textarea :ref="`a${scienceleader.id}`" class="feedback-submit" />
            <a-button
              @click="feedbackSubmit(`a${scienceleader.id}`)"
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
      interest: ["Ужасный", "Плохой", "Нормальный", "Хороший", "Отличный"]
    };
  },
  methods: {
    getRate(id) {
      const count = this.$store.state.scienceleaders.find(el => el.id === id)
        .feedbacks.length;
      if (count === 0) return 0;
      const sum = this.$store.state.scienceleaders
        .find(el => el.id === id)
        .feedbacks.reduce((ac, c) => ac + c.overall_rate, 0);
      return Math.round(sum / count) / 2;
    },
    async feedbackSubmit(id) {
      let _id = id.slice(1);
      await this.$store.dispatch("scienceleaderFeedback", {
        id: _id,
        overall_rate: Math.round(this.interest_value * 2),
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
