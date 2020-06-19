const EasemobCfg = {
  
  cluster:'EBS',
  servicePlanName:{
    enterPrise:'enterprise',
    callbackMSg:'callback',
    videoService:'media'
  },
  console:{
    url: location.protocol + '//im-console.easemob.com',
  },
  rest: {
    url: location.protocol + '//a1.easemob.com',
  },
  imData: {
    url: location.protocol + '//imdata.easemob.com',
  },
  killbill:{
  	url: location.protocol + '//killbill.easemob.com/ebs',
  },
  // payment:{
  // 	url: location.protocol + '//killbill-hsb.easemob.com/hsb',
  // },
  ticket: {
      enabled: true,
      url: "https://im.tickets.easemob.com/im/open_ticket.php"
  },
  // payment:{
  //   url: 'http://payment-hsb.easemob.com:80',
  // }
};

if(window.location.href.indexOf("console4-hsb.easemob.com") >= 0 || window.location.href.indexOf("http://localhost") >= 0 || window.location.href.indexOf("172.17.2.168") >= 0 ){
  EasemobCfg.cluster = 'HSB';
  EasemobCfg.rest.url = location.protocol + '//a1-rest2-hsb.easemob.com';
  EasemobCfg.imData.url = location.protocol + '//imdata-hsb.easemob.com';
  EasemobCfg.killbill.url = location.protocol + '//killbill-hsb.easemob.com/hsb';
  EasemobCfg.console.url = location.protocol + '//im-console-hsb.easemob.com';
}
if(window.location.href.indexOf("console-vip6.easemob.com") >= 0){
  EasemobCfg.cluster = 'VIP6';
  EasemobCfg.rest.url = location.protocol + '//a1-vip6.easemob.com';
  EasemobCfg.imData.url = location.protocol + '//imdata-vip6.easemob.com';
  EasemobCfg.killbill.url = location.protocol + '//killbill.easemob.com/vip6';
}







export default EasemobCfg;
