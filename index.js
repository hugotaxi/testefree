var respostx, tabelaidgasto, resultado_pesquisa, todosvalores, codigoapesquisar, todoscodigos, id, rendaporabstecimento, Item, vlabastecimento, kmfinal, kminicial;

function codigoabastecimento() {
  function getRowsSearch() {
    fetch(bb_baserow_url + "api/database/rows/table/" + tabelaidgasto + "/?user_field_names=true&filter__field_" + '1188504' + "__" + "equal" + "=" + 'Abastecimento' + "&order_by=" + "+" + 'informacao' + "&page=" + '0', {
      method: "GET",
      headers: {
        "Authorization": "Token " + bb_baserow_token
      }
    })
    .then(response => response.json())
    .then(data => {
      $("#loading-spinner").hide();
      resultado_pesquisa = data.results;
      id = 0;
      var Item_list = (resultado_pesquisa.reverse());
      
      for (var Item_index in Item_list) {
        Item = Item_list[Item_index];
        id = id + 1;
        
        if (resultado_pesquisa.length > 1) {
          kmfinal = ((resultado_pesquisa[1])['km']);
          kminicial = ((resultado_pesquisa[0])['km']);
        }

        // Novo layout moderno do card mantendo sua estrutura de dados
        var card = '<div onclick="callefetuadas(' + id + ')" class="meus_cards" id="card_' + id + '">';
        card += '  <div class="card-left">';
        card += '    <div class="icon-wrapper">';
        card += '      <i class="bi bi-fuel-pump"></i>';
        card += '    </div>';
        card += '    <div class="card-info">';
        card += '      <span class="titulo_meus_cards">R$ ' + String(Item['valor']) + '</span>';
        card += '      <span class="subtitulo_meus_cards"><i class="bi bi-calendar3 me-1"></i>' + (Item['data']) + '</span>';
        card += '    </div>';
        card += '  </div>';
        card += '  <div class="card-right">';
        card += '    <span class="badge-km"><i class="bi bi-signpost-2 me-1 text-primary"></i>' + String(Item['km']) + ' km</span>';
        card += '    <span class="tap-hint">Ver saldo <i class="bi bi-chevron-right"></i></span>';
        card += '  </div>';
        card += '</div>';

        document.getElementById("telaabastecimento").innerHTML += card;
        
        if (resultado_pesquisa.length > 1) {
          var kmRodados = kminicial - kmfinal;
          $("#text_1").html('Último: <strong>' + kmRodados + ' Km</strong>');
        } else {
          $("#text_1").html('Aguardando 2º registro');
        }
      }
    })
    .catch((error) => {
      $("#loading-spinner").html('<span class="text-danger">Erro ao carregar dados.</span>');
      console.error("Error:", error);
    });
  }
  getRowsSearch();
}

function faz_algo() {
  todosvalores = [];
  rendaporabstecimento = [];
  vlabastecimento = 0;
  
  $("#txtsaldo").html('<span style="font-size: 13px; color: #94a3b8;">Calculando...</span>');

  function getRowsSearch() {
    fetch(bb_baserow_url + "api/database/rows/table/" + '177842' + "/?user_field_names=true&filter__field_" + '5090261' + "__" + "equal" + "=" + codigoapesquisar + "&order_by=" + "+" + 'codigo' + "&page=" + '0', {
      method: "GET",
      headers: {
        "Authorization": "Token " + bb_baserow_token
      }
    })
    .then(response => response.json())
    .then(data => {
      rendaporabstecimento = data.results;
      id = 0;
      for (var Item_index2 in rendaporabstecimento) {
        Item = rendaporabstecimento[Item_index2];
        id = id + 1;
        todosvalores.push((Item['valor']));
      }
      for (var Item_index3 in todosvalores) {
        Item = todosvalores[Item_index3];
        vlabastecimento = (txt_to_number(vlabastecimento)) + (txt_to_number(Item));
      }
      
      // Formata o valor para o padrão brasileiro (ex: R$ 245,50)
      var saldoFormatado = vlabastecimento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      $("#txtsaldo").html(saldoFormatado);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }
  getRowsSearch();
}

function callefetuadas(respostx) {
  // Destaca visualmente o card selecionado
  $(".meus_cards").removeClass("card-ativo");
  $("#card_" + respostx).addClass("card-ativo");

  codigoapesquisar = ((resultado_pesquisa[(respostx - 1)])['codigo']);
  faz_algo();
}

var bb_baserow_token = 'IKrER8jZ6NQENRIxVlNeF65L5J3ss1LH';
var bb_baserow_url = 'https://api.baserow.io/';

// Inicialização
tabelaidgasto = '177843';
todoscodigos = [];
codigoapesquisar = [];
rendaporabstecimento = [];
todosvalores = [];
vlabastecimento = 0;
kminicial = 0;
kmfinal = 0;
codigoabastecimento();

function qclick() {
  let elementoClick = document.getElementById('text_1');
  if (elementoClick) {
    elementoClick.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }
}
qclick();

function txt_to_number(txt) {
  txt = txt + "";
  if (txt.includes(",")) {
    txt = txt.replace(",", ".");
  }
  if (txt.includes(".")) {
    txt = parseFloat(txt);
  } else {
    txt = parseInt(txt);
  }
  return isNaN(txt) ? 0 : txt;
}

$(document).ready(function () {
  $("#loading-page-bb").css("opacity", "1");
});