package com.ebiz.backend;

import com.ebiz.backend.entity.Product;
import com.ebiz.backend.entity.User;
import com.ebiz.backend.repository.ProductRepository;
import com.ebiz.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class EbizBackendApplicationTests {

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private UserRepository userRepository;

	@Test
	void testFindAllById() {
		List<String> ids = List.of("6a357eb000160fac42ccd0d0", "6a30292a00160fac42ccd0ce");
		System.out.println("=== Testing findAllById for IDs: " + ids);
		List<User> found = userRepository.findAllById(ids);
		System.out.println("Found users count: " + found.size());
		for (User u : found) {
			System.out.println("Found user: " + u.getId() + ", name=" + u.getName());
		}
	}


}

