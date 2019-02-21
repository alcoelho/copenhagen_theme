document.addEventListener('DOMContentLoaded', function () {

  function closest(element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector);
    }
    do {
      if (Element.prototype.matches && element.matches(selector)
        || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
        || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  }

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(this.href, '', 'height = 500, width = 500');
    });
  });

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var commentContainerTextarea = document.querySelector('.comment-container textarea'),
    commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');

  if (commentContainerTextarea) {
    commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
      commentContainerFormControls.style.display = 'block';
      commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
    });

    if (commentContainerTextarea.value !== '') {
      commentContainerFormControls.style.display = 'block';
    }
  }

  // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
    requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
    requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function () {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function (e) { e.style.display = 'block'; });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
    requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
    requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function () {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true);
      requestCommentSubmitButton.disabled = true;
      this.setAttribute('data-disabled', true);
      // Element.closest is not supported in IE11
      closest(this, 'form').submit();
    });
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function () {
      if (requestCommentTextarea.value === '') {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
        }
        requestCommentSubmitButton.disabled = true;
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
        }
        requestCommentSubmitButton.disabled = false;
      }
    });
  }

  // Disable submit button if textarea is empty
  if (requestCommentTextarea && requestCommentTextarea.value === '') {
    requestCommentSubmitButton.disabled = true;
  }

  // Submit requests filter form in the request list page
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function (el) {
    el.addEventListener('change', function (e) {
      e.stopPropagation();
      closest(this, 'form').submit();
    });
  });

  function toggleNavigation(toggleElement) {
    var menu = document.getElementById('user-nav');
    var isExpanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', !isExpanded);
    toggleElement.setAttribute('aria-expanded', !isExpanded);
  }

  var burgerMenu = document.querySelector('.header .icon-menu');
  var userMenu = document.querySelector('#user-nav');

  burgerMenu.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleNavigation(this);
  });

  burgerMenu.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) { // Enter key
      e.stopPropagation();
      toggleNavigation(this);
    }
  });

  userMenu.addEventListener('keyup', function (e) {
    if (e.keyCode === 27) { // Escape key
      e.stopPropagation();
      this.setAttribute('aria-expanded', false);
      burgerMenu.setAttribute('aria-expanded', false);
    }
  });

  if (userMenu.children.length === 0) {
    burgerMenu.style.display = 'none';
  }

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function () {
      closest(this, 'form').submit();
    });
  }

  // Toggles expanded aria to collapsible elements
  Array.prototype.forEach.call(document.querySelectorAll('.collapsible-nav, .collapsible-sidebar'), function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      var isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
    });
  });



  // # SETUP DO FORMULÁRIO CUSTOMIZADO

  authCustomForm();
  //copiaAnexos();

  // mapa com o ID do elemento de cada campo associado ao ID do campo no backend do zendesk
  const fieldMap = {
    'request-data': '360016030491',
    'request-origem': '360016898612',
    'request-finalidade-terceiro': '360016930391',
    'request-finalidade-proprio': '360016898672',
    'request-filial': '360016898912',
    'request_codforn_protheus': '360016930691',
    'request-responsabilidade': '360016898932',
    'request_codtrans_protheus': '360016940091',
    'request_placa': '360016930711',
    'request_qtdvol': '360016941931',
    'request_especie': '360016898972',
    'request_pbruto': '360016930751',
    'request_pliquido': '360016898992',
    'request-observ': '360016899492',
    'request-posicao-estoque': '360016898852',

  }

  // configura cada campo
  for (let selector in fieldMap) {
    const backendId = fieldMap[selector];
    setupField(selector, backendId);
  }

  // remove o formulário default
  $('#new_request').remove();

  // adiciona máscaras
  // máscaras reversas começam a entrada a partir do último dígito; eg. dinheiro começa a entrada a partir dos centavos
  $('.protheus').mask('999999');
  $('.date').mask('00/00/0000');
  $('#request_placa').mask('AAAAAAAAAA');
  $('#request_pbruto').mask('000.000.000.000.000,000', { reverse: true });
  $('#request_pliquido').mask('000.000.000.000.000,000', { reverse: true });
  $('.qtd').mask('999999');
  $('.money').mask('000.000.000.000.000.000.000,00', { reverse: true });

  // valida formulário. regras estão inline nos elementos
  $('#custom_form').validate();

  // calcula valor total de materiais quando campos .qtd e .valor forem alterados
  $('#materiais').on('change, keyup', '.qtd, .valor', function(event){
    const $row = $(this).closest('tr');
    calculateTotalPrice($row)
  });

  // antes de enviar o formulário:
  // 1) coloca a descrição dos materiais na textarea oculta #request_materials
  // 2) coloca um título (requerido) em #request_subject
  $('#custom_form').on('submit', function (event) {
    $('#request_materials').val(describeMaterials());
    $('#request_subject').val(makeTitle());
  });

});

/* authCustomForm()
 * habilita autenticação no formulário customizado: 
 * 1) copiando o campo auth_token do formulário original
 * 2) copiando todos os atributos (action, method, etc) do formulário original 
*/
function authCustomForm() {
  const $requestAuthField = $('#new_request input[name=authenticity_token]');
  const $originalForm = $('#new_request');
  const originalAttributes = $originalForm[0].attributes;
  const $ourForm = $('#custom_form');
  $ourForm.append($requestAuthField); //move campo de autenticação p/ o formulário customizado
  // percorre cada atributo
  for (let i = 0, attribute; attribute = originalAttributes[i], i < originalAttributes.length; i++) {
    if (attribute.name == 'id') continue; //ignora o atributo ID
    $ourForm.attr(attribute.name, attribute.value);
  }

}

/**
 * setFieldName ( elementId, backendFieldId )
 * configura o elemento de ID _elementId_ de forma que o atributo __name__ deste corresponda com o customfield de id _fieldId_.
 * se o elemento passado via _elementId_ não for um select, input ou textarea, será procurado um elemento filho deste que o seja.
 * @param string elementId: id do campo HTML a ter o nome alterado
 * @param string backendId: o ID do campo customizado no backend do zendesk
 * @returns {jQuery} o campo
 */
function setFieldName(elementId, backendFieldId) {
  let $field = $("#" + elementId);
  if (!$field.is('input, select, textarea')) {
    $field = $field.find('input, select, textarea');
  }
  const fieldName = "request[custom_fields][" + backendFieldId + "]";
  $field.attr('name', fieldName);
  return $field;
}

function copiaAnexos() {
  const $divAnexos = $('#new_request .form-field:last')
  const $originalForm = $('#new_request');
  const $ourForm = $('#custom_form');

  $ourForm.find('footer').before($divAnexos);
}

/**
 * copyOptions ( idSource, idDest )
 * copia as opções de um select gerado pelo zendesk via data-attributes no campo _idSource_ para o campo _idDest_ na forma de elementos <option>s 
 * o select resultante não é compatível com a biblioteca de interface do zendesk.
 * @param string idSource id do campo original 
 * @param string idDest id do campo no formulário customizado
 * @returns {jQuery} o campo destino
 */
function copyOptions(idSource, idDest) {
  const $source = $('#' + idSource);
  const $dest = $('#' + idDest);
  const $destSelect = $dest.find('select');
  const values = $source.data('tagger');
  $dest.find('option').remove();

  values.forEach(function (item) {
    const $option = $('<option>')
    $option.val(item.value);
    $option.html(item.label);
    $destSelect.append($option);
  });

  $destSelect.show();
  $dest.find('a').remove();
  return $dest;
}

/**
 * setupField ( elementId, backendFieldId )
 * configura um campo para uso, evocando setFieldName() e, 
 * se ele for um select, copyOptions()
 * @param string elementId 
 * @param string backendFieldId
 * @returns {jQuery} o campo
 */
function setupField(elementId, backendFieldId) {
  const $field = setFieldName(elementId, backendFieldId);
  if ($field.is('select') || $field.find('select').length != 0) {
    copyOptions('request_custom_fields_' + backendFieldId, elementId);
  }
  return $field;
}

function escondeDiv(elemento) {
  let selecionado = elemento.options[elemento.selectedIndex].value;
  document.getElementById('request-finalidade0').style.display = 'none';

  if (selecionado === 'proprio') {
    document.getElementById('request-finalidade-proprio').style.display = 'block';
    document.getElementById('request-finalidade-terceiro').style.display = 'none';
  } else {
    document.getElementById('request-finalidade-terceiro').style.display = 'block';
    document.getElementById('request-finalidade-proprio').style.display = 'none';
  }
}

function criaLinha() {
  let linhaClonada = $('.material:first').clone();
  linhaClonada.find('input[type=text]').val('');
  $('#materiais').append(linhaClonada);
}

/**
 * describeMaterial ( $row )
 * cria e retorna uma string descrevendo um material com os dados de _$row_
 * @param {jQuery} $row uma linha (<tr>) representando um material 
 * @returns string a string descrevendo o material
 */
function describeMaterial($row) {
  let labels = ["Cod. Produto", "Descrição", "Num. Série", "Quantidade", "Valor", "Total", "NF Origem"];
  let material = "";
  $row.find('input').each(function (i, input) {
    const value = $(input).val();
    const label = labels[i];
    material += label + ': ' + value + '  ';
  });
  return material;
}

/**
 * describeMaterials()
 * retorna uma string descrevendo todos os materiais presentes, um por linha
 * chamando describeMaterial(linha) para cada linha
 * @returns string a string descrevendo todos os materiais
 */
function describeMaterials() {
  let materials = '';
  $('#materiais tr').each(function (i, row) {
    materials += describeMaterial($(row)) + '\n';
  });
  return materials;
}

/**
 * makeTitle()
 * retorna uma string para ser usada como título da nota fiscal
 * @returns string titulo p/ nota
 */
function makeTitle() {
  // Data Origem Filial PesoB.
  const date = $('#request-data').val();
  const origem = $('#request-origem-opcoes').val() == 'material_petrorio' ? 'PetroRio' : '3o';
  const filial = $('#request-filial select option:selectd').text();
  const peso = $('#request_pbruto').val();

  return date + ' ' + origem + ' ' + filial + ' ' + peso;

}

/**
 * calculateTotalPrice($material)
 * calcula o valor total de uma linha de materiais _$material_
 * multiplicando o valor unitário pela quantidade
 * seta o campo _.total_ com o valor calculado
 * @returns string o valor total
 */
function calculateTotalPrice($material) {
  const amount = $material.find('.qtd').val();
  let value = $material.find('.valor').val();
  value = value.replace(/\./g, '');
  value = value.replace(',', '.');
  const $total = $material.find('.total');

  let total = parseFloat(amount) * parseFloat(value);
  if (total) {
    total = total.toFixed(2).toString();
    total = total.replace('.', '');
    total = $total.masked(total);
    $total.val( total );
    return total;
  } else { return null; }
}