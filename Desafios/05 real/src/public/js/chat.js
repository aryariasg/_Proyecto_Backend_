const socketClient = io();

const tituloUsuario = document.getElementById(`usuario`);
const formulario = document.getElementById('formulario');
const inputMensaje = document.getElementById('message');
const divChat = document.getElementById('chat');

let usuario;

// Disparar alerta de ingreso al chat SWEET ALERT
Swal.fire({
	title: 'Input email address',
	input: 'email',
	inputLabel: 'Your email address',
	inputPlaceholder: 'Enter your email address',
}).then((username) => {
	usuario = username.value;
	tituloUsuario.innerText = `Hola ${usuario}`;
	// Evento de username ingresado
	socketClient.emit('usuarioNuevo', usuario);
	inputMensaje.value = '';
});

// MENSAJES
formulario.onsubmit = async (e) => {
	e.preventDefault();
	const info = {
		user: usuario,
		message: inputMensaje.value,
	};
	socketClient.emit('message', info);
	formulario.reset();
};

// CHAT
function validator(message) {
	if (message.user && message.message) {
		return true;
	} else {
		if (!message.user) {
			throw new Error(`User missing`);
		} else if (!message.message) {
			throw new Error(`Message missing`);
		}
	}
}

socketClient.on('chat', (mensajes) => {
	//	console.log(mensajes);
	const chatParrafo = mensajes
		.map((obj) => {
			return `<p>${obj.user}: ${obj.message} </p>`;
		})
		.join('');
	divChat.innerHTML = chatParrafo;
});

// Notif usuario nuevo conectado
socketClient.on('broadcast', (usuario) => {
	Toastify({
		text: `${usuario} conectado al chat`,
		duration: 3000,
		position: 'right', // `left`, `center` or `right`
		style: {
			background: 'linear-gradient(to right, #00b09b, #96c93d)',
		},
		onClick: function () {}, // Callback after click
	}).showToast();
});
