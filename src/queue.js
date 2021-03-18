class Nodo {
        constructor(value) {
        this.value = value;
        this.next= null;
        }
}

class Queue {
        constructor() {
        this.head= null;
        this.tail= null;
        this.length= 0;
	}
ponerenCola(value) {
    	const node = new Nodo(value); // Crea el nodo usando la clase Nodo

    	if (this.head) { // Si sale el primer nodo
        	this.tail.next = node; // Inserta el nodo creado después de la cola
       		this.tail = node; // Ahora el nodo creado es el último nodo
   	 } else { // Si no hay nodos en la cola
       		this.head = node; // El nodo creado lo llamaré 'head'
       		this.tail = node // También el nodo creado es una cola en la cola porque es único
	    }

	    this.length++; // Aumenta la longitud de la cola en 1
	}


eliminarCola() {
    	const current = this.head; // Guarda el enlace en el 'head' que debemos eliminar
    	this.head = this.head.next; // Mueve el enlace 'head' al segundo nodo en la cola
   	 this.length--; // Decrementamos la longitud de la cola

    	return current.value; // Devuelve el valor del nodo eliminado
	}

mostrarCola() {
 	   let actual = this.head; // Guarda un enlace en el 'head' de la cola

    	while(actual) { // Pasa por cada nodo de la cola
        	console.log(actual.value); // Imprime el valor del nodo en la consola
        	actual = actual.next; // Mueve el enlace al siguiente nodo después del 'head'
    	}
	}

siEstaVacio() {
    	return this.length === 0;
	}

obtenerPrimerNodo() {
    	return this.head.value;
	}

obtenerCantidadNodos() {
    	return this.length;
	}

}

class Canal {
        constructor() {
        this.nombre=null;
	}
}



module.exports = Queue;
