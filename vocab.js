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
      {h:'猴子', p:'hóuzi', e:'monkey', emoji:'🐵'}
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
    ]}
  ];
});
