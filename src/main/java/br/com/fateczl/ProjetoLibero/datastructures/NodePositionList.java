package br.com.fateczl.ProjetoLibero.datastructures;

import java.util.Iterator;
import java.util.List;

import org.olap4j.Position;
import org.olap4j.metadata.Member;

public class NodePositionList<E> implements Position {
	protected int numElts;
	protected DNode <E> header, trailer;
	
	public NodePositionList() {
		numElts = 0;
		header = new DNode<E>(null, null, null);
		trailer = new DNode<E>(header, null, null);
		header.setNext(trailer);
	}
	
	protected DNode<E> checkPosition(Position p) {
		if (p == null) { System.out.println("Posicao nula passada para o NodeList"); }
		if (p == header) { System.out.println("Header invalido"); }
		if (p == trailer) { System.out.println("Trailer invalido"); }
		
		try {
			@SuppressWarnings("unchecked")
			DNode<E> temp = (DNode <E>) p;
			if ((temp.getPrev() == null) || (temp.getNext() == null)) {
				//posição não pertence
				
			}
			return temp;
		} catch (ClassCastException e) {
			throw new Error("Posicao esta com tipo errado para essa lista");
		}
	}
	
	public int size() {return numElts; }
	
	public boolean isEmpty() { return (numElts == 0); }
	
	public Position first() {
		if(isEmpty()) { System.out.println("Esta vazia."); }
		return header.getNext();
	}
	
	public Position prev(Position p) {
		DNode<E> v = checkPosition(p);
		DNode<E> prev = v.getPrev();
		if (prev == header) {
			System.out.println("Nada para avançar depois do começo da lista.");
			
		}
		return prev;
	}
	
	public void addBefore(Position p, E element) {
		DNode<E> v = checkPosition(p);
		numElts++;
		DNode<E> newNode = new DNode<E>(v.getPrev(), v, element);
		v.getPrev().setNext(newNode);
		v.setPrev(newNode);
	}
	
	public void addFirst(E element) {
		numElts++;
		DNode<E> newNode = new DNode<E>(header, header.getNext(), element);
		header.getNext().setPrev(newNode);
		header.setNext(newNode);
	}
	
	public E remove(Position p) {
		DNode<E> v = checkPosition(p);
		numElts--;
		DNode<E> vPrev = v.getPrev();
		DNode<E> vNext = v.getNext();
		vPrev.setNext(vNext);
		vNext.setPrev(vPrev);
		E vElem = v.element();
		//desconecta, marca como invalido
		v.setNext(null);
		v.setPrev(null);
		return vElem;
	}
	
	public E set(Position p, E element) {
		DNode<E> v = checkPosition(p);
		E oldElt = v.element();
		v.setElement(element);
		return oldElt;
	}
	
	public static <E> String toString(Position l) {
		Iterator<E> it = (Iterator<E>) ((List<Member>) l).iterator();
		String s = " [";
		while(it.hasNext()) {
			s += it.next();
			if(it.hasNext()) s+= ", ";
			
		}
		s += "] ";
		return s;
	}

	@Override
	public List<Member> getMembers() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int getOrdinal() {
		// TODO Auto-generated method stub
		return 0;
	}

}
