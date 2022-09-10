package br.com.fateczl.ProjetoLibero.controller;

import java.rmi.ServerException;
import java.sql.SQLException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonCreator;

import br.com.fateczl.ProjetoLibero.model.Assunto;
import br.com.fateczl.ProjetoLibero.rest.AssuntoControllerRest;

@RestController
@RequestMapping("assuntos")
public class AssuntoController {
	
	private final AssuntoControllerRest assuntoService;
	
	@JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
	public AssuntoController(AssuntoControllerRest assuntoService) {
		this.assuntoService = assuntoService;
	}
	
	@GetMapping( 	
			consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE },
			produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE } )
	public List<Assunto> op(@RequestBody Assunto assuntos) {
		
		return assuntoService.getAssuntosById();
	}
	
	@PostMapping(
	        consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE },
	        produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE } )
	public ResponseEntity<Assunto> createAssunto(@RequestBody Assunto a, String cod) throws ServerException, ClassNotFoundException, SQLException {
		
		return assuntoService.createAssunto(a, cod);
	}
	
}
