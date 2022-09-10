package br.com.fateczl.ProjetoLibero.rest;

import java.rmi.ServerException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import br.com.fateczl.ProjetoLibero.model.Assunto;
import br.com.fateczl.ProjetoLibero.persistence.AssuntoDao;

@Service
public class AssuntoControllerRest {
	
	@Autowired
	AssuntoDao aDao;

	@SuppressWarnings("finally")
	@JsonPropertyOrder("Assunto")
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
		@JsonPropertyOrder("Assunto")
	    public List<Assunto> getAssuntosById() {
	        int id = 1;
	        
	        List<Assunto> listaAssuntosDeUsuario = new ArrayList<Assunto>();
	        @SuppressWarnings("unused")
			String erro = "";
	        
	        try {
	            listaAssuntosDeUsuario = aDao.listaAssuntosDeUsuario(id);
	        } catch (ClassNotFoundException | SQLException e) {
				erro = e.getMessage();
			}
	        return listaAssuntosDeUsuario;
	    }
}
