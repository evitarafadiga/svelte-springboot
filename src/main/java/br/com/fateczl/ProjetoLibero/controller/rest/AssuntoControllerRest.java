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
import org.springframework.web.bind.annotation.RestController;

import br.com.fateczl.ProjetoLibero.model.Assunto;
import br.com.fateczl.ProjetoLibero.persistence.AssuntoDao;

@RestController
@RequestMapping("assuntos")
public class AssuntoControllerRest {
	
	@Autowired
	AssuntoDao aDao;

	@SuppressWarnings("finally")
	@PostMapping(
	        consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE },
	        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE } )
	public ResponseEntity<Assunto> createAssunto(@RequestBody Assunto a, String cod) throws ClassNotFoundException, SQLException, ServerException {
		
		String err = "";
		@SuppressWarnings("unused")
		String saida = "";
		
		try {
			if (a == null) {
				throw new ServerException(err);
			}
			if (cod.contains("I")) {
				saida = aDao.insertAssunto(a);
				@SuppressWarnings("unused")
				Assunto assun = new Assunto.Builder(a.getId()).build();
			}
			if (cod.contains("D")) {
				saida = aDao.deleteAssunto(a);
				@SuppressWarnings("unused")
				Assunto assun = new Assunto.Builder(a.getId()).build();
			}
			if (cod.contains("U")) {
				saida = aDao.updateAssunto(a);
				@SuppressWarnings("unused")
				Assunto assun = new Assunto.Builder(a.getId()).build();
			}
			else {
				return new ResponseEntity<>(a, HttpStatus.CREATED);
			}
		} catch (SQLException e) {
			err = e.getMessage();
		} finally {
			return new ResponseEntity<> (a, HttpStatus.CREATED);
			
		}
		
	    
	}	
}
