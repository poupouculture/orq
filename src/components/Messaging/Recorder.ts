import { ref } from "vue";
import { Notify } from "quasar";
import Recorder from "recorder-core";
// 引入相应格式支持文件；如果需要多个格式支持，把这些格式的编码引擎js文件放到后面统统引入进来即可
import "recorder-core/src/engine/mp3";
import "recorder-core/src/engine/mp3-engine"; // 如果此格式有额外的编码引擎（*-engine.js）的话，必须要加上

// 以上三个也可以合并使用压缩好的recorder.xxx.min.js
// 比如 import Recorder from 'recorder-core/recorder.mp3.min' //已包含recorder-core和mp3格式支持

// 可选的插件支持项
// import "recorder-core/src/extensions/waveview";

// 简单控制台直接测试方法：在任意(无CSP限制)页面内加载Recorder，加载成功后再执行一次本代码立即会有效果，import("https://xiangyuecn.gitee.io/recorder/recorder.mp3.min.js").then(function(s){console.log("import ok")}).catch(function(e){console.error("import fail",e)})

const rec: any = ref(null);
/** 调用open打开录音请求好录音权限**/
const recOpen = function (success?: () => void) {
  // 一般在显示出录音按钮或相关的录音界面时进行此方法调用，后面用户点击开始录音时就能畅通无阻了
  rec.value = Recorder({
    // 本配置参数请参考下面的文档，有详细介绍
    type: "mp3",
    sampleRate: 16000,
    bitRate: 16, // mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
    onProcess: function () // buffers: Buffer,
    // powerLevel: number,
    // bufferDuration: number,
    // bufferSampleRate: number,
    // newBufferIdx: Buffer,
    // asyncEnd: any
    {
      console.log(
        "录制过程"
        // buffers,
        // powerLevel,
        // bufferDuration,
        // bufferSampleRate,
        // newBufferIdx,
        // asyncEnd
      );

      // 录音实时回调，大约1秒调用12次本回调，buffers为开始到现在的所有录音pcm数据块(16位小端LE)
      // 可实时绘制波形（extensions目录内的waveview.js、wavesurfer.view.js、frequency.histogram.view.js插件功能）
      // 可利用extensions/sonic.js插件实时变速变调，此插件计算量巨大，onProcess需要返回true开启异步模式
      // 可实时上传（发送）数据，配合Recorder.SampleData方法，将buffers中的新数据连续的转换成pcm上传，或使用mock方法将新数据连续的转码成其他格式上传，可以参考文档里面的：Demo片段列表 -> 实时转码并上传-通用版；基于本功能可以做到：实时转发数据、实时保存数据、实时语音识别（ASR）等
    },
  });

  // var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
  rec.value.open(
    function () {
      // 打开麦克风授权获得相关资源
      // dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
      // rec.start() 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程

      success && success();
    },
    function (msg: string, isUserNotAllow: string) {
      // 用户拒绝未授权或不支持
      // dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
      Notify.create({
        message: isUserNotAllow
          ? "Please turn on the recording permission of the browser"
          : msg,
        position: "top",
        type: "negative",
        color: "purple",
      });
    }
  );
};

/** 开始录音**/
function recStart() {
  // 打开了录音后才能进行start、stop调用
  rec.value.start();
}

/** 结束录音**/
function recStop() {
  rec.value.stop(
    function (blob: Blob, duration: number) {
      console.log(
        blob,
        (window.URL || window.webkitURL).createObjectURL(blob),
        "时长:" + duration + "ms"
      );
      rec.value.close(); // 释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
      rec.value = null;

      // 已经拿到blob文件对象想干嘛就干嘛：立即播放、上传

      /** * 【立即播放例子】 ***/
      const audio = document.createElement("audio");
      audio.controls = true;
      // document.body.appendChild(audio);
      // 简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
      audio.src = (window.URL || window.webkitURL).createObjectURL(blob);
      audio.play();
    },
    function (msg: string) {
      console.log("recording error:" + msg);
      rec.value.close(); // 可以通过stop方法的第3个参数来自动调用close
      rec.value = null;
    }
  );
}

function play() {
  if (rec.value) {
    recStart();
    // recOpen();
  } else {
    recOpen(recStart);
  }
}

// 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调
/* 伪代码：
function createDelayDialog(){
    if(Is Mobile){//只针对移动端
        return new Alert Dialog Component
            .Message("录音功能需要麦克风权限，请允许；如果未看到任何请求，请点击忽略~")
            .Button("忽略")
            .OnClick(function(){//明确是用户点击的按钮，此时代表浏览器没有发起任何权限请求
                //此处执行fail逻辑
                console.log("无法录音：权限请求被忽略");
            })
            .OnCancel(NOOP)//自动取消的对话框不需要任何处理
            .Delay(8000); //延迟8秒显示，这么久还没有操作基本可以判定浏览器有毛病
    };
};
*/

// 这里假设立即运行，只录3秒，录完后立即播放，本段代码copy到控制台内可直接运行
// recOpen(function () {
//   recStart();
//   setTimeout(recStop, 10000);
// });

export default {
  recOpen,
  recStart,
  recStop,
  play,
};
