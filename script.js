document.addEventListener('DOMContentLoaded', function() {
  
  function closest (element, selector) {
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
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function(anchor) {
    anchor.addEventListener('click', function(e) {
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
    showRequestCommentContainerTrigger.addEventListener('click', function() {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
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
    requestCommentTextarea.addEventListener('input', function() {
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
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
    el.addEventListener('change', function(e) {
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

  burgerMenu.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleNavigation(this);
  });

  burgerMenu.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) { // Enter key
      e.stopPropagation();
      toggleNavigation(this);
    }
  });

  userMenu.addEventListener('keyup', function(e) {
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
    requestOrganisationSelect.addEventListener('change', function() {
      closest(this, 'form').submit();
    });
  }

  // Toggles expanded aria to collapsible elements
  Array.prototype.forEach.call(document.querySelectorAll('.collapsible-nav, .collapsible-sidebar'), function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      var isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
    });
  });
  

  
  authCustomForm();
  copiaAnexos();
  
  copyOptions('request_custom_fields_360016321092', 'request-origem');
  copyOptions('request_custom_fields_360016305772', 'request-finalidade-proprio');
  copyOptions('request_custom_fields_360016305792', 'request-finalidade-terceiro');
  copyOptions('request_custom_fields_360016304072', 'request-filial');
  copyOptions('request_custom_fields_360016304092', 'request-responsabilidade');
  copyOptions('request_custom_fields_360016304132', 'request_codtrans_protheus');
  
  $('#new_request').remove();
  
  $('#custom_form').on('submit', function(event){
    $('#request_materials').val(describeMaterials());
    $('#request_subject').val('Nova NF');
  });
  
});

/* authCustomForm()
 * habilita autenticação no formulário customizado copiando o auth_token do formulário original
 * também remove o formulário original
 * TODO: copiar também os atributos do form (action, data-form, etc)
*/
function authCustomForm(){
  const $requestAuthField = $('#new_request input[name=authenticity_token]');
  const $originalForm = $('#new_request');
  const $ourForm = $('#custom_form');

  $ourForm.append($requestAuthField); //move campo de autenticação p/ o formulário customizado
}


function copiaAnexos() {
  const $divAnexos = $('#new_request .form-field:last')
  const $originalForm = $('#new_request');
  const $ourForm = $('#custom_form');

  $ourForm.find('footer').before($divAnexos); 
}

function copyOptions(idSource, idDest) {
  const $source = $('#'+idSource);
  const $dest = $('#'+idDest);
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

function describeMaterial ($row) {
  let labels = ["Cod. Produto", "Descrição", "Num. Série", "Quantidade", "Valor", "Total", "NF Origem"];
  let material = "";
  $row.find('input').each(function(i, input){
    const value = $(input).val();
    const label = labels[i];
    material += label + ': ' + value + '  ';
  });
  return material;
}

function describeMaterials () {
  let materials = '';
  $('#materiais tr').each(function (i, row){
    materials += describeMaterial($(row)) + '\n';
  });
  return materials;
}
  
  
