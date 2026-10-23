// Single source of truth for the site's vocabulary: loaded by the browser (window.LONGBAO_VOCAB) and by the AI helper API (require).
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LONGBAO_VOCAB = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return [
    { id:'animals', name:'动物朋友', icon:'🐾', color:'var(--green)', words:[
      {h:'猫', p:'māo', e:'cat', emoji:'🐱'},
      {h:'狗', p:'gǒu', e:'dog', emoji:'🐶'},
      {h:'兔', p:'tù', e:'rabbit', emoji:'🐰'},
      {h:'鸟', p:'niǎo', e:'bird', emoji:'🐦'},
      {h:'鱼', p:'yú', e:'fish', emoji:'🐟'},
      {h:'老虎', p:'lǎohǔ', e:'tiger', emoji:'🐯'},
      {h:'熊猫', p:'xióngmāo', e:'panda', emoji:'🐼'},
      {h:'猴子', p:'hóuzi', e:'monkey', emoji:'🐵'},
      {h:'龙', p:'lóng', e:'dragon', emoji:'🐉'},
      {h:'独角兽', p:'dújiǎoshòu', e:'unicorn', emoji:'🦄'},
      {h:'大象', p:'dàxiàng', e:'elephant', emoji:'🐘'},
      {h:'长颈鹿', p:'chángjǐnglù', e:'giraffe', emoji:'🦒'},
      {h:'狮子', p:'shīzi', e:'lion', emoji:'🦁'},
      {h:'熊', p:'xióng', e:'bear', emoji:'🐻'},
      {h:'马', p:'mǎ', e:'horse', emoji:'🐴'},
      {h:'牛', p:'niú', e:'cow', emoji:'🐮'},
      {h:'猪', p:'zhū', e:'pig', emoji:'🐷'},
      {h:'青蛙', p:'qīngwā', e:'frog', emoji:'🐸'},
      {h:'乌龟', p:'wūguī', e:'turtle', emoji:'🐢'},
      {h:'企鹅', p:"qǐ'é", e:'penguin', emoji:'🐧'}
    ]},
    { id:'colors', name:'颜色魔法', icon:'🎨', color:'var(--purple)', words:[
      {h:'红色', p:'hóngsè', e:'red', emoji:'🔴'},
      {h:'黄色', p:'huángsè', e:'yellow', emoji:'🟡'},
      {h:'蓝色', p:'lánsè', e:'blue', emoji:'🔵'},
      {h:'绿色', p:'lǜsè', e:'green', emoji:'🟢'},
      {h:'紫色', p:'zǐsè', e:'purple', emoji:'🟣'},
      {h:'黑色', p:'hēisè', e:'black', emoji:'⚫'},
      {h:'白色', p:'báisè', e:'white', emoji:'⚪'},
      {h:'橙色', p:'chéngsè', e:'orange', emoji:'🟠'}
    ]},
    { id:'numbers', name:'数字大冒险', icon:'🔢', color:'var(--gold)', words:[
      {h:'一', p:'yī', e:'one', emoji:'1️⃣'},
      {h:'二', p:'èr', e:'two', emoji:'2️⃣'},
      {h:'三', p:'sān', e:'three', emoji:'3️⃣'},
      {h:'四', p:'sì', e:'four', emoji:'4️⃣'},
      {h:'五', p:'wǔ', e:'five', emoji:'5️⃣'},
      {h:'六', p:'liù', e:'six', emoji:'6️⃣'},
      {h:'七', p:'qī', e:'seven', emoji:'7️⃣'},
      {h:'八', p:'bā', e:'eight', emoji:'8️⃣'},
      {h:'九', p:'jiǔ', e:'nine', emoji:'9️⃣'},
      {h:'十', p:'shí', e:'ten', emoji:'🔟'}
    ]},
    { id:'fruits', name:'水果篮子', icon:'🍎', color:'var(--red)', words:[
      {h:'苹果', p:'píngguǒ', e:'apple', emoji:'🍎'},
      {h:'香蕉', p:'xiāngjiāo', e:'banana', emoji:'🍌'},
      {h:'西瓜', p:'xīguā', e:'watermelon', emoji:'🍉'},
      {h:'草莓', p:'cǎoméi', e:'strawberry', emoji:'🍓'},
      {h:'葡萄', p:'pútáo', e:'grape', emoji:'🍇'},
      {h:'橙子', p:'chéngzi', e:'orange', emoji:'🍊'},
      {h:'桃子', p:'táozi', e:'peach', emoji:'🍑'},
      {h:'梨', p:'lí', e:'pear', emoji:'🍐'}
    ]},
    { id:'family', name:'我的家人', icon:'👪', color:'var(--blue)', words:[
      {h:'爸爸', p:'bàba', e:'dad', emoji:'👨'},
      {h:'妈妈', p:'māma', e:'mom', emoji:'👩'},
      {h:'哥哥', p:'gēge', e:'big brother', emoji:'👦'},
      {h:'姐姐', p:'jiějie', e:'big sister', emoji:'👧'},
      {h:'弟弟', p:'dìdi', e:'little brother', emoji:'🧒'},
      {h:'妹妹', p:'mèimei', e:'little sister', emoji:'👶'},
      {h:'爷爷', p:'yéye', e:'grandpa', emoji:'👴'},
      {h:'奶奶', p:'nǎinai', e:'grandma', emoji:'👵'}
    ]},
    { id:'body', name:'身体部位', icon:'🖐️', color:'var(--red)', words:[
      {h:'眼睛', p:'yǎnjing', e:'eye', emoji:'👁️'},
      {h:'耳朵', p:'ěrduo', e:'ear', emoji:'👂'},
      {h:'鼻子', p:'bízi', e:'nose', emoji:'👃'},
      {h:'嘴巴', p:'zuǐba', e:'mouth', emoji:'👄'},
      {h:'牙齿', p:'yáchǐ', e:'tooth', emoji:'🦷'},
      {h:'手', p:'shǒu', e:'hand', emoji:'✋'},
      {h:'脚', p:'jiǎo', e:'foot', emoji:'🦶'},
      {h:'腿', p:'tuǐ', e:'leg', emoji:'🦵'},
      {h:'手臂', p:'shǒubì', e:'arm', emoji:'💪'},
      {h:'心', p:'xīn', e:'heart', emoji:'❤️'}
    ]},
    { id:'nature', name:'大自然', icon:'🌈', color:'var(--green)', words:[
      {h:'太阳', p:'tàiyáng', e:'sun', emoji:'☀️'},
      {h:'月亮', p:'yuèliang', e:'moon', emoji:'🌙'},
      {h:'星星', p:'xīngxing', e:'star', emoji:'⭐'},
      {h:'云', p:'yún', e:'cloud', emoji:'☁️'},
      {h:'雨', p:'yǔ', e:'rain', emoji:'🌧️'},
      {h:'雪', p:'xuě', e:'snow', emoji:'❄️'},
      {h:'风', p:'fēng', e:'wind', emoji:'💨'},
      {h:'花', p:'huā', e:'flower', emoji:'🌸'},
      {h:'树', p:'shù', e:'tree', emoji:'🌳'},
      {h:'山', p:'shān', e:'mountain', emoji:'⛰️'}
    ]},
    { id:'food', name:'美食小吃', icon:'🍜', color:'var(--gold)', words:[
      {h:'米饭', p:'mǐfàn', e:'rice', emoji:'🍚'},
      {h:'面条', p:'miàntiáo', e:'noodles', emoji:'🍜'},
      {h:'面包', p:'miànbāo', e:'bread', emoji:'🍞'},
      {h:'鸡蛋', p:'jīdàn', e:'egg', emoji:'🥚'},
      {h:'牛奶', p:'niúnǎi', e:'milk', emoji:'🥛'},
      {h:'饺子', p:'jiǎozi', e:'dumpling', emoji:'🥟'},
      {h:'蛋糕', p:'dàngāo', e:'cake', emoji:'🎂'},
      {h:'冰淇淋', p:'bīngqílín', e:'ice cream', emoji:'🍦'},
      {h:'糖果', p:'tángguǒ', e:'candy', emoji:'🍬'},
      {h:'汉堡', p:'hànbǎo', e:'hamburger', emoji:'🍔'}
    ]},
    { id:'transport', name:'交通出行', icon:'🚗', color:'var(--blue)', words:[
      {h:'汽车', p:'qìchē', e:'car', emoji:'🚗'},
      {h:'公交车', p:'gōngjiāochē', e:'bus', emoji:'🚌'},
      {h:'火车', p:'huǒchē', e:'train', emoji:'🚆'},
      {h:'飞机', p:'fēijī', e:'airplane', emoji:'✈️'},
      {h:'船', p:'chuán', e:'ship', emoji:'🚢'},
      {h:'自行车', p:'zìxíngchē', e:'bicycle', emoji:'🚲'},
      {h:'出租车', p:'chūzūchē', e:'taxi', emoji:'🚕'},
      {h:'地铁', p:'dìtiě', e:'subway', emoji:'🚇'},
      {h:'火箭', p:'huǒjiàn', e:'rocket', emoji:'🚀'},
      {h:'直升机', p:'zhíshēngjī', e:'helicopter', emoji:'🚁'}
    ]},
    { id:'actions', name:'动作表情', icon:'🏃', color:'var(--purple)', words:[
      {h:'吃', p:'chī', e:'eat', emoji:'🍽️'},
      {h:'喝', p:'hē', e:'drink', emoji:'🥤'},
      {h:'跑', p:'pǎo', e:'run', emoji:'🏃'},
      {h:'跳', p:'tiào', e:'jump', emoji:'🤸'},
      {h:'睡觉', p:'shuìjiào', e:'sleep', emoji:'😴'},
      {h:'笑', p:'xiào', e:'laugh', emoji:'😄'},
      {h:'哭', p:'kū', e:'cry', emoji:'😢'},
      {h:'看', p:'kàn', e:'look', emoji:'👀'},
      {h:'听', p:'tīng', e:'listen', emoji:'🎧'},
      {h:'唱歌', p:'chànggē', e:'sing', emoji:'🎤'}
    ]}
  ];
});
