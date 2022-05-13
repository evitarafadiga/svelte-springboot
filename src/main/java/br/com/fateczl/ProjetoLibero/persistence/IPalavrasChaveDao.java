package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.SQLException;

import br.com.fateczl.ProjetoLibero.model.PalavraChave;

public interface IPalavrasChaveDao {

	String insertPalavraChave(PalavraChave p) throws SQLException;

	String updatePalavraChave(PalavraChave p) throws SQLException;

	String deletePalavraChave(PalavraChave p) throws SQLException;
	
	

}
