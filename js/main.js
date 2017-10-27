const api = "https://api.ethplorer.io/getAddressInfo/";
const apiKey = "?apiKey=freekey";

function conslist() {
  let addresses = $('#addr').val().split('\n');
  addresses = addresses.filter(entry => entry.trim() != '');
  addresses = addresses.filter(item => item.indexOf("0x") == 0);
  lookup(addresses);
}


function lookup(publicKeys) {
  $("#progress").html(`<div class="ui indicating progress" data-value="${0}" data-total="${publicKeys.length}" id="example5">\
    <div class="bar"></div>\
    <div class="label">Checking address</div>\
  </div>\
  `)
  $('#example5')
    .progress({
      text: {
        active: 'Checked {value} of {total} addresses',
        success: '{total} addresses checked!'
      }
    });
  for (let i = 0; i < publicKeys.length; i++) {
    let counter = 0;
    const address = [];
    let token = [];
    let hasToken = false;
    $.getJSON(api + publicKeys[i] + apiKey, data => {
      $('#example5')
        .progress('increment');
      counter++;
      if (data["tokens"]) {
        $.each(data["tokens"], (key, value) => {
          const tokenSym = data["tokens"][key]["tokenInfo"]["name"];
          const tokenBal = data["tokens"][key]["balance"];
          token.push({
            tokenSym,
            tokenBal
          });
          hasToken = true;
        });
      }
      const addr = data["address"];
      const balance = data["ETH"]["balance"];
      if (hasToken) {
        address.push({
          etherAddress: addr,
          etherBalance: balance,
          token
        });
        $("#addresslist").append(`\
          <div class='item'>\
          <i class='chevron right icon'></i>\
            <div class='content ${addr}'>\
              <div class='header'>${addr}</div>\
              <div class='description'>${balance}</div>\
        `);
        for (let i = 0; i < token.length; i++) {
          $(`.${addr}`).append(`\
          <div class='list'>\
            <div class='item'>\
            <i class='chevron up icon'></i>\
              <div class='content'>\
                <div class='header'>${token[i]["tokenSym"]}</div>\
                <div class='description'>${token[i]["tokenBal"]}</div>\
              </div>\
            </div>\
          `);
        }

      } else {
        address.push({
          etherAddress: addr,
          etherBalance: balance
        });
        if (balance > 0) {
          $("#addresslist").append(`\
            <div class='item'>\
            <i class='chevron right icon'></i>\
            <div class='content'>\
            <div class='header'>${addr}</div>\
            <div class='description'>${balance}</div>\
            </div>\
            </div>\
            `);
        }
      }
      console.log(address);
      token = [];
      hasToken = false;
    });
  }
}
