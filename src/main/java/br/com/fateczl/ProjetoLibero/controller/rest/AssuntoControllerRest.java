package br.com.fateczl.ProjetoLibero.controller.rest;

import java.rmi.ServerException;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.com.fateczl.ProjetoLibero.model.Assunto;
import br.com.fateczl.ProjetoLibero.persistence.AssuntoDao;

@RestController
@RequestMapping(value = "/#/createassuntos", method = RequestMethod.POST)
public class AssuntoControllerRest {
	
	@Autowired
	AssuntoDao aDao;

	@PostMapping( path = "/createassuntos",
	        consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE },
	        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE } )
	public ResponseEntity<Assunto> createAssunto(@RequestBody Assunto a, String cod) throws ClassNotFoundException, SQLException, ServerException {
		Assunto a2 = aDao.insereAssunto(a);
		String err = "";
		String saida = "";
		if (a == null) {
			throw new ServerException(err);
		} else {
			return new ResponseEntity<>(a2, HttpStatus.CREATED);
		}
	    
	}	
}
