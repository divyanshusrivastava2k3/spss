import { describe, it, expect } from 'vitest';
import {
  SettingsSchema,
  ProgramSchema,
  BlogPostSchema,
  PartnerSchema,
  TeamMemberSchema,
  GalleryImageSchema,
  DirectorMessageSchema,
  HomeContentSchema,
  AboutContentSchema,
  validateBody,
} from '@/lib/validators';

describe('Validators', () => {
  describe('SettingsSchema', () => {
    it('should validate valid settings data', () => {
      const validData = {
        ngoName: 'Test NGO',
        ngoNameHi: 'टेस्ट एनजीओ',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#166534',
        secondaryColor: '#15803d',
        accentColor: '#16a34a',
        aboutText: 'About us',
        aboutTextHi: 'हमारे बारे में',
        contactEmail: 'test@example.com',
        contactPhone: '+91 1234567890',
        address: 'Test Address',
        addressHi: 'टेस्ट पता',
        metaTitle: 'Meta Title',
        metaTitleHi: 'मेटा शीर्षक',
        metaDescription: 'Meta Description',
        metaDescriptionHi: 'मेटा विवरण',
        facebookUrl: 'https://facebook.com/test',
        twitterUrl: 'https://twitter.com/test',
        instagramUrl: 'https://instagram.com/test',
        youtubeUrl: 'https://youtube.com/test',
        linkedinUrl: 'https://linkedin.com/test',
      };

      const result = validateBody(SettingsSchema, validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ngoName).toBe('Test NGO');
        expect(result.data.primaryColor).toBe('#166534');
      }
    });

    it('should reject invalid hex color', () => {
      const invalidData = {
        ngoName: 'Test',
        ngoNameHi: 'टेस्ट',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: 'invalid-color',
        secondaryColor: '#15803d',
        accentColor: '#16a34a',
        aboutText: 'About',
        aboutTextHi: 'हमारे बारे में',
        contactEmail: 'test@example.com',
        contactPhone: '+91 1234567890',
        address: 'Test Address',
        addressHi: 'टेस्ट पता',
        metaTitle: 'Meta',
        metaTitleHi: 'मेटा',
        metaDescription: 'Desc',
        metaDescriptionHi: 'विवरण',
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        linkedinUrl: '',
      };

      const result = validateBody(SettingsSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        ngoName: 'Test',
        ngoNameHi: 'टेस्ट',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#166534',
        secondaryColor: '#15803d',
        accentColor: '#16a34a',
        aboutText: 'About',
        aboutTextHi: 'हमारे बारे में',
        contactEmail: 'invalid-email',
        contactPhone: '+91 1234567890',
        address: 'Test Address',
        addressHi: 'टेस्ट पता',
        metaTitle: 'Meta',
        metaTitleHi: 'मेटा',
        metaDescription: 'Desc',
        metaDescriptionHi: 'विवरण',
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        linkedinUrl: '',
      };

      const result = validateBody(SettingsSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept empty string for optional URLs', () => {
      const validData = {
        ngoName: 'Test',
        ngoNameHi: 'टेस्ट',
        logoUrl: '',
        faviconUrl: '',
        primaryColor: '#166534',
        secondaryColor: '#15803d',
        accentColor: '#16a34a',
        aboutText: 'About',
        aboutTextHi: 'हमारे बारे में',
        contactEmail: 'test@example.com',
        contactPhone: '+91 1234567890',
        address: 'Test Address',
        addressHi: 'टेस्ट पता',
        metaTitle: 'Meta',
        metaTitleHi: 'मेटा',
        metaDescription: 'Desc',
        metaDescriptionHi: 'विवरण',
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        linkedinUrl: '',
      };

      const result = validateBody(SettingsSchema, validData);
      expect(result.success).toBe(true);
    });
  });

  describe('ProgramSchema', () => {
    it('should validate valid program data', () => {
      const validData = {
        title: 'Skill Development Program',
        titleHi: 'कौशल विकास कार्यक्रम',
        description: 'Learn new skills',
        descriptionHi: 'नए कौशल सीखें',
        imageUrl: 'https://example.com/image.jpg',
        category: 'skill-development',
        categoryHi: 'कौशल विकास',
        startDate: '2024-01-15T00:00:00.000Z',
        endDate: '2024-06-15T00:00:00.000Z',
        isActive: true,
        order: 1,
      };

      const result = validateBody(ProgramSchema, validData);
      expect(result.success).toBe(true);
    });

    it('should require title and description', () => {
      const invalidData = {
        title: '',
        description: '',
      };

      const result = validateBody(ProgramSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept empty strings for optional dates', () => {
      const validData = {
        title: 'Program',
        description: 'Description',
        startDate: '',
        endDate: '',
      };

      const result = validateBody(ProgramSchema, validData);
      expect(result.success).toBe(true);
    });
  });

  describe('BlogPostSchema', () => {
    it('should validate valid blog post data', () => {
      const validData = {
        title: 'Test Blog Post',
        titleHi: 'टेस्ट ब्लॉग पोस्ट',
        slug: 'test-blog-post',
        excerpt: 'Short excerpt',
        excerptHi: 'छोटा अंश',
        content: 'Full content here',
        contentHi: 'पूरी सामग्री यहाँ',
        featuredImage: 'https://example.com/image.jpg',
        author: 'Author Name',
        authorHi: 'लेखक नाम',
        publishedAt: '2024-01-15T00:00:00.000Z',
        isPublished: true,
        tags: 'tag1,tag2',
        category: 'news',
        categoryHi: 'समाचार',
        language: 'en',
      };

      const result = validateBody(BlogPostSchema, validData);
      expect(result.success).toBe(true);
    });

    it('should require title, slug, and content', () => {
      const invalidData = {
        title: '',
        slug: '',
        content: '',
      };

      const result = validateBody(BlogPostSchema, invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('PartnerSchema', () => {
    it('should validate valid partner data', () => {
      const validData = {
        name: 'Partner Org',
        nameHi: 'पार्टनर संस्था',
        logoUrl: 'https://example.com/logo.png',
        websiteUrl: 'https://partner.org',
        description: 'Partner description',
        descriptionHi: 'पार्टनर विवरण',
        category: 'education',
        order: 1,
        isActive: true,
      };

      const result = validateBody(PartnerSchema, validData);
      expect(result.success).toBe(true);
    });

    it('should require name and logoUrl', () => {
      const invalidData = {
        name: '',
        logoUrl: '',
      };

      const result = validateBody(PartnerSchema, invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('TeamMemberSchema', () => {
    it('should validate valid team member data', () => {
      const validData = {
        name: 'John Doe',
        nameHi: 'जॉन डो',
        designation: 'Director',
        designationHi: 'निदेशक',
        bio: 'Bio here',
        bioHi: 'जीवनी यहाँ',
        photoUrl: 'https://example.com/photo.jpg',
        email: 'john@example.com',
        phone: '+91 1234567890',
        linkedinUrl: 'https://linkedin.com/in/john',
        twitterUrl: 'https://twitter.com/john',
        facebookUrl: 'https://facebook.com/john',
        order: 1,
        isActive: true,
      };

      const result = validateBody(TeamMemberSchema, validData);
      expect(result.success).toBe(true);
    });

    it('should require name and designation', () => {
      const invalidData = {
        name: '',
        designation: '',
      };

      const result = validateBody(TeamMemberSchema, invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('GalleryImageSchema', () => {
    it('should validate valid gallery image data', () => {
      const validData = {
        title: 'Event Photo',
        titleHi: 'इवेंट फोटो',
        imageUrl: 'https://example.com/photo.jpg',
        category: 'events',
        categoryHi: 'इवेंट्स',
        description: 'Event description',
        descriptionHi: 'इवेंट विवरण',
        order: 1,
        isActive: true,
      };

      const result = validateBody(GalleryImageSchema, validData);
      expect(result.success).toBe(true);
    });

    it('should require title and imageUrl', () => {
      const invalidData = {
        title: '',
        imageUrl: '',
      };

      const result = validateBody(GalleryImageSchema, invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('DirectorMessageSchema', () => {
    it('should validate valid director message data', () => {
      const validData = {
        directorName: 'Dr. Name',
        directorNameHi: 'डॉ. नाम',
        directorTitle: 'Director',
        directorTitleHi: 'निदेशक',
        message: 'Director message',
        messageHi: 'निदेशक संदेश',
        photoUrl: 'https://example.com/photo.jpg',
        signatureUrl: 'https://example.com/signature.png',
        isActive: true,
      };

      const result = validateBody(DirectorMessageSchema, validData);
      expect(result.success).toBe(true);
    });

    it('should require directorName, directorTitle, message, messageHi', () => {
      const invalidData = {
        directorName: '',
        directorTitle: '',
        message: '',
        messageHi: '',
      };

      const result = validateBody(DirectorMessageSchema, invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('validateBody helper', () => {
    it('should return success with data on valid input', () => {
      const schema = z.object({ name: z.string().min(1) });
      const result = validateBody(schema, { name: 'Test' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Test');
      }
    });

    it('should return error details on invalid input', () => {
      const schema = z.object({ name: z.string().min(1) });
      const result = validateBody(schema, { name: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toBeDefined();
        expect(result.errors.fieldErrors).toBeDefined();
      }
    });
  });
});

// Need to import z for the last test
import { z } from 'zod';