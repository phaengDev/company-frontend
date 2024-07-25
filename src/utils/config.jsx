import Swal from "sweetalert2"; 
import { Notification } from "rsuite";
  const Alert = {
    errorLoing(name){ 
      Swal.fire({
      title: 'ຂໍອະໄພ!',
      text: name,
      icon: 'error',
      width:400,
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: "#3085d6",
    })
  },
    errorData(name){ 
      Swal.fire({
      title: 'ຂໍອະໄພ!',
      text: name,
      icon: 'error',
      width:400,
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: "#3085d6",
    })
  },
  infoData(name){ 
    Swal.fire({
    title: 'ຂໍອະໄພ!',
    text: name,
    icon: 'info',
    width:400,
    confirmButtonText: 'ຕົກລົງ',
    confirmButtonColor: "#3085d6",
  })
},
  successData(name){ 
    Swal.fire({
    title: 'ຢືນຢັນ!',
    text: name,
    icon: 'success',
    width:400,
    confirmButtonText: 'ຕົກລົງ',
    confirmButtonColor: "#0fac29",
  })
},


Successreload(){
  Swal.fire({
    title: "ຢືນຢັນ",
    text: "ການດຳເນີນງານສຳເລັດແລ້ວ",
    icon: "success",
    width:400,
    buttons: {
      confirm: {
        text: "ຕົກລົງ",
        value: true,
        visible: true,
        className: "btn btn-success",
        closeModal: true,
      },
    },
  }).then((confirm) => {
    if (confirm) {
      window.location.reload();
    }
  });
},

Successlocation(Url){
  Swal.fire({
    title: "ຢືນຢັນ",
    text: "ການດຳເນີນງານສຳເລັດແລ້ວ",
    icon: "success",
    width:400,
    buttons: {
      confirm: {
        text: "ຕົກລົງ",
        value: true,
        visible: true,
        className: "btn btn-success",
        closeModal: true,
      },
    },
  }).then((confirm) => {
    if (confirm) {
      window.location.href = Url;
    }
  });
}
  }
  export default Alert;

  
