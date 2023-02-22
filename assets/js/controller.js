document.addEventListener("DOMContentLoaded", () => {
  const formCode = window.btoa(window.location.pathname);
  let formSubmited = localStorage.getItem(`formSubmited-${formCode}`);
  formSubmited = formSubmited ? parseInt(formSubmited) : formSubmited;
  const haveSubmited = () => {
    let thanksNode = document.createElement("h1");
    thanksNode.classList.add("center");
    thanksNode.classList.add("color-primary");
    thanksNode.innerHTML = "TERIMAKASIH SUDAH BERPARTISIPASI";
    let infoNode = document.createElement("p");
    infoNode.classList.add("center");
    infoNode.classList.add("color-white");
    infoNode.innerHTML = `Kami akan mengirim info ke Email / Whatsapp, untuk informasi lebih lanjut kamu bisa DM kami di instagram <a href="https://www.instagram.com/bandung.coders/" target="_blank" class="color-primary">bandung.coders</a>`;
    let form = document.getElementById("registerForm");
    let container = form.parentNode;
    container.append(thanksNode);
    container.append(infoNode);
    form.remove();
  }

  if (formSubmited === 1) {
    haveSubmited();
  }

  const modalId = "modal-warning";
  const btnAgree = "btnAgree";
  const btnDisagree = "btnDisagree";
  const backend = "https://api.bacod.id/";
  const inputFields = document.querySelectorAll(".remove-message");
  const bacod = axios.create({
    baseURL: backend
  });
  let loadingSubmit = false;

  for (let a = 0; a < inputFields.length; a++) {
    const inputField = inputFields[a];
    inputField.addEventListener("keyup", (thisNode) => {
      let inputMessage = inputField.parentNode.nextElementSibling;
      inputMessage.innerHTML = "";
    })
  }

  const loadingSpinner = (size) => {
    return `
      <div class="spin">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
      </div>`;
  }

  const isRequired = (name) => {
    return `${name} is required`;
  }

  const submitData = () => {
    loadingSubmit = true;
    let form = document.getElementById("registerForm");
    let formId = form.getAttribute("form-id");
    let answerFields = form.querySelectorAll(".question");
    let answers = [];
    if (formId) {
      let formData = {
        eventId: formId,
        name: form.name.value,
        whatsapp: form.whatsapp.value,
        email: form.email.value,
        answers: answers
      };
  
      for (let a = 0; a < answerFields.length; a++) {
        const answerField = answerFields[a];
        answers.push({
          questionId: answerField.getAttribute("question-id"),
          response: answerField.value,
        });
      }
  
      bacod.post("candidate/register", formData)
        .then((response) => {
          if (response.data.success) {
            document.getElementById("registerForm").reset();
            localStorage.setItem(`formSubmited-${formCode}`, 1);
            haveSubmited();
            modalSuccess();
          } else {
            modalError();
          }
        })
        .catch((error) => {
          if (error) {
            modalError();
          }
        })
        .finally(() => {
          loadingSubmit = false;
        });
    } else {
      modalError();
    }
  }

  const openModal = () => {
    const bacodFramework = document.getElementById("bacod-framework");
    let modalText = "Data yang kamu input akan tersimpan di database BACOD sampai kedepannya, kamu yakin ingin mengirim data ini?";

    const modalMain = document.createElement("div");
    modalMain.classList.add("modal");
    modalMain.id = modalId;
    const modal = `
    <div class="modal-wrapper">
      <div class="modal-background"></div>
      <div class="modal-box modal-box-responsive modal-box-radius-md">
        <h3 class="modal-title">MOHON DIBACA</h3>
        ${modalText}
        <div class="modal-footer">
          <button type="button" id="${btnAgree}" class="btn btn-primary btn-small">IYA</button>
          <button type="button" id="${btnDisagree}" class="btn btn-white btn-small mt-3">TIDAK</button>
        </div>
      </div>
    </div>`;
    modalMain.innerHTML = modal;
    bacodFramework.prepend(modalMain);
      
    const agree = document.getElementById(btnAgree);
    const disagree = document.getElementById(btnDisagree);
    const modalBackground = document.querySelectorAll(`#${modalId} .modal-wrapper .modal-background`)[0];

    agree.addEventListener("click", () => {
      let agreeText = agree.innerHTML;
      agree.disabled = true;
      disagree.disabled = true;
      agree.innerHTML = '<div class="center-button">' + agreeText + '&nbsp; ' + loadingSpinner(24) + "</div>";
      submitData();
    });

    disagree.addEventListener("click", () => {
      agree.disabled = false;
      disagree.disabled = false;
      closeModal();
    });

    modalBackground.addEventListener("click", () => {
      agree.disabled = false;
      disagree.disabled = false;
      closeModal();
    });
  }

  const modalSuccess = () => {
    const modalBox = document.querySelectorAll("div#modal-warning div.modal-wrapper div.modal-box")[0];
    modalBox.innerHTML = `
    <div class="center-middle">
      <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#4F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>
    <h3 class="center">DATA TERKIRIM</h3>
    <p class="center">Kami mengirim pemberitahuan ke Whatsapp atau Email. Jika kamu tidak menerimanya coba pastikan nomor yang kamu masukan sesuai dengan nomor whatsapp kamu, Untuk pertanyaan lebih lanjut kamu bisa DM kami di instagram <a href="https://www.instagram.com/bandung.coders/" target="_blank" class="color-primary">bandung.coders</a></p>
    <div class="center">
      <button type="button" id="ok" class="btn btn-primary">OK</div>
    </div>
    `;
    
    document.getElementById("ok").addEventListener("click", () => {
      closeModal();
    });
  }

  const modalError = () => {
    const modalBox = document.querySelectorAll("div#modal-warning div.modal-wrapper div.modal-box")[0];
    modalBox.innerHTML = `
    <div class="center-middle">
      <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#F44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    </div>
    <h3 class="center">TERJADI KESALAHAN</h3>
    <p class="center">Maaf terjadi kesalahan, silahkan coba kembali atau DM kami di instagram <a href="https://www.instagram.com/bandung.coders/" target="_blank" class="color-primary">bandung.coders</a></p>
    <div class="center">
        <button type="button" id="ok" class="btn btn-primary">OK</div>
    </div>
    `;
    
    document.getElementById("ok").addEventListener("click", () => {
      closeModal();
    });
  }

  const closeModal = () => {
    const modalWarning = document.getElementById(modalId);
    if (loadingSubmit === false) {
      modalWarning.remove();
    }
  }

  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let inputNodes = registerForm.querySelectorAll("input");
    let textareaNodes = registerForm.querySelectorAll("textarea");
    let selectNodes = registerForm.querySelectorAll("select");
    let error = 0;
    
    for (let a = 0; a < inputNodes.length; a++) {
      const inputNode = inputNodes[a];
      const parentElement = inputNode.parentNode.previousElementSibling;
      if (parentElement.classList.contains("required")) {
        if (inputNode.value.length === 0) {
          let inputMessage = inputNode.parentNode.nextElementSibling;
          inputMessage.innerHTML = isRequired(inputNode.getAttribute("name"));
          error++;
        }
      }
    }

    for (let a = 0; a < selectNodes.length; a++) {
      const selectNode = selectNodes[a];
      const parentElement = selectNode.parentNode.previousElementSibling;
      if (parentElement.classList.contains("required")) {
        if (selectNode.value.length === 0) {
          let selectMessage = selectNode.parentNode.nextElementSibling;
          selectMessage.innerHTML = isRequired("this question");
          error++;
        }
      }
    }

    for (let a = 0; a < textareaNodes.length; a++) {
      const textareaNode = textareaNodes[a];
      const parentElement = textareaNode.parentNode.previousElementSibling;
      if (parentElement.classList.contains("required")) {
        if (textareaNode.value.length === 0) {
          let inputMessage = textareaNode.parentNode.nextElementSibling;
          inputMessage.innerHTML = isRequired("this question");
          error++;
        }
      }
    }
    
    if (error === 0) {
      openModal();
    }
  });
});