<template>
  <div>Recoder</div>
  <q-btn @click="recOpen">recOpen</q-btn>
</template>

<script setup lang="ts">
// 引入js库
import Recorder from "recorder-core";
// 引入需要使用到的音频格式编码引擎的js文件
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine";
// 如果要绘制音频波形图，需要引入
import "recorder-core/src/extensions/waveview";
const recOpen = () => {
  const rec = Recorder({
    type: "mp3", // wav格式, 需要使用的type类型，需提前把格式支持文件加载进来
    bitRate: 36, // 比特率kbps，越大音质越好
    sampleRate: 18000, // 采样率hz，每秒音波震动次数，越大细节越丰富
    onProcess: function (
      buffers: any,
      powerLevel: any,
      duration: any,
      sampleRate: any
    ) {
      console.log(buffers, powerLevel, duration, sampleRate);
      // buffers, // [[Int16,...],...]：缓冲的PCM数据，为从开始录音到现在的所有pcm片段，每次回调可能增加0-n个不定量的pcm片段
      // powerLevel, // 输入的音频波动值0-100
      // duration, // 录音持续时间ms
      // sampleRate, // 录音使用的采样率
      // 利用waveview扩展实时绘制波形
      // This.wave.input(buffers[buffers.length - 1], powerLevel, sampleRate);
    }, // 录音实时回调，大约1秒调用12次回调
  });
  rec.open(
    function () {
      console.log("打开成功：");
      // 渲染音频波形图
      // This.wave = Recorder.WaveView({ elem: ".ctrlProcessWave" });
    },
    function (msg: string, isUserNotAllow: boolean) {
      // 浏览器不支持录音、用户拒绝麦克风权限、或者非安全环境（非https、file等
      console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg);
      rec.close();
    }
  );
};
</script>
