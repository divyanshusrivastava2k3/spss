import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@spss.org',
      password: hashedPassword,
      role: 'admin',
    },
  })

  // Seed initial settings if not exists
  const settings = await prisma.settings.findFirst()
  if (!settings) {
    await prisma.settings.create({
      data: {
        ngoName: 'Sardar Patel Shikshan Sansthan',
        ngoNameHi: 'सरदार पटेल शिक्षण संस्थान',
        primaryColor: '#166534',
        secondaryColor: '#15803d',
        aboutText: 'Empowering rural communities through education, skill development, and sustainable livelihoods.',
        aboutTextHi: 'शिक्षा, कौशल विकास और स्थायी आजीविका के माध्यम से ग्रामीण समुदायों को सशक्त बनाना।',
        contactEmail: 'contact@spss.org',
        contactPhone: '+91 532 454 1842',
        address: 'Village Kaserua Kala, Azad Nagar, Tehsil Phulpur, Prayagraj, Uttar Pradesh',
        addressHi: 'ग्राम कसेरुआ कला, आजाद नगर, तहसील फूलपुर, प्रयागराज, उत्तर प्रदेश',
      },
    })
  }

  // Seed home page content if not exists
  const home = await prisma.homePageContent.findFirst()
  if (!home) {
    await prisma.homePageContent.create({
      data: {
        heroTitle: 'Building a Better Tomorrow for Everyone',
        heroTitleHi: 'सभी के लिए एक बेहतर कल का निर्माण',
        heroSubtitle: 'Empowering rural communities through education, skill development, and sustainable livelihoods.',
        heroSubtitleHi: 'शिक्षा, कौशल विकास और स्थायी आजीविका के माध्यम से ग्रामीण समुदायों को सशक्त बनाना।',
        heroCtaText: 'Our Programs',
        heroCtaTextHi: 'हमारे कार्यक्रम',
        heroCtaLink: '/programs',
      },
    })
  }

  // Seed about page content if not exists
  const about = await prisma.aboutPageContent.findFirst()
  if (!about) {
    await prisma.aboutPageContent.create({
      data: {
        missionContent: 'To create an educated, skilled, self-reliant, and socially responsible society through education, skill development, and livelihood promotion programs.',
        missionContentHi: 'शिक्षा, कौशल विकास और आजीविका संवर्धन कार्यक्रमों के माध्यम से एक शिक्षित, कुशल, आत्मनिर्भर और सामाजिक रूप से जिम्मेदार समाज का निर्माण करना।',
        visionContent: 'To build a society where science, technology, and traditional knowledge work together for sustainable and inclusive development of all communities.',
        visionContentHi: 'एक ऐसा समाज बनाना जहां विज्ञान, प्रौद्योगिकी और पारंपरिक ज्ञान सभी समुदायों के सतत और समावेशी विकास के लिए मिलकर काम करें।',
        historyContent: 'Founded in 1988 by respected Chairperson Suryabali Singh, Sardar Patel Shikshan Sansthan began with the vision of providing quality education. Today, we work across education, skill development, women empowerment, and rural development in Uttar Pradesh.',
        historyContentHi: '1988 में माननीय अध्यक्ष सूर्यबली सिंह द्वारा स्थापित, सरदार पटेल शिक्षण संस्थान की शुरुआत गुणवत्तापूर्ण शिक्षा प्रदान करने की दृष्टि से हुई। आज, हम उत्तर प्रदेश में शिक्षा, कौशल विकास, महिला सशक्तिकरण और ग्रामीण विकास के क्षेत्रों में काम करते हैं।',
      },
    })
  }

  // Seed director message
  const directorMsg = await prisma.directorMessage.findFirst()
  if (!directorMsg) {
    await prisma.directorMessage.create({
      data: {
        directorName: 'Suryabali Singh',
        directorNameHi: 'सूर्यबली सिंह',
        directorTitle: 'Chairperson & Director',
        directorTitleHi: 'अध्यक्ष एवं निदेशक',
        message: 'Since 1988, our organization has been dedicated to the holistic development of rural communities. We believe that education, skill development, and sustainable livelihoods are the keys to empowering individuals and communities. Together with our dedicated team and partners, we strive to create an educated, skilled, and self-reliant society.',
        messageHi: '1988 से, हमारा संगठन ग्रामीण समुदायों के समग्र विकास के लिए समर्पित है। हम मानते हैं कि शिक्षा, कौशल विकास और स्थायी आजीविका व्यक्तियों और समुदायों को सशक्त बनाने की कुंजी हैं। अपनी समर्पित टीम और साझेदारों के साथ मिलकर, हम एक शिक्षित, कुशल और आत्मनिर्भर समाज बनाने का प्रयास करते हैं।',
      },
    })
  }

  // Seed initial partners
  const partners = await prisma.partner.count()
  if (partners === 0) {
    await prisma.partner.createMany({
      data: [
        {
          name: 'Ministry of Skill Development & Entrepreneurship',
          nameHi: 'कौशल विकास और उद्यमिता मंत्रालय',
          logoUrl: '',
          websiteUrl: 'https://www.msde.gov.in',
          description: 'ODOP - One District One Product Initiative',
          descriptionHi: 'ओडीओपी - एक जिला एक उत्पाद पहल',
          category: 'government',
          order: 1,
        },
        {
          name: 'Vishwakarma Shram Samman Yojana',
          nameHi: 'विश्वकर्मा श्रम सम्मान योजना',
          logoUrl: '',
          websiteUrl: '',
          description: 'VSSY - Skill development for traditional artisans',
          descriptionHi: 'वीएसएसवाई - पारंपरिक कारीगरों के लिए कौशल विकास',
          category: 'government',
          order: 2,
        },
        {
          name: 'NITI Aayog',
          nameHi: 'नीति आयोग',
          logoUrl: '',
          websiteUrl: 'https://www.niti.gov.in',
          description: 'NGO Darpan Registration Partner',
          descriptionHi: 'एनजीओ दर्पण पंजीकरण साझेदार',
          category: 'government',
          order: 3,
        },
        {
          name: 'DICCI',
          nameHi: 'डीआईसीसीआई',
          logoUrl: '',
          websiteUrl: 'https://www.dicci.co.in',
          description: 'SC/ST Vendor Development Programme',
          descriptionHi: 'एससी/एसटी वेंडर विकास कार्यक्रम',
          category: 'ngo',
          order: 4,
        },
        {
          name: 'PFRDA',
          nameHi: 'पीएफआरडीए',
          logoUrl: '',
          websiteUrl: 'https://www.pfrda.org.in',
          description: 'National Pension System (NPS) Awareness',
          descriptionHi: 'राष्ट्रीय पेंशन प्रणाली (एनपीएस) जागरूकता',
          category: 'government',
          order: 5,
        },
      ],
    })
  }

  // Seed team members
  const teamCount = await prisma.teamMember.count()
  if (teamCount === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          name: 'Suryabali Singh',
          nameHi: 'सूर्यबली सिंह',
          designation: 'Chairperson & Director',
          designationHi: 'अध्यक्ष एवं निदेशक',
          bio: 'Founder and visionary leader with over 35 years of experience in education and rural development.',
          bioHi: 'शिक्षा और ग्रामीण विकास में 35 वर्षों से अधिक अनुभव वाले संस्थापक और दूरदर्शी नेता।',
          order: 1,
        },
        {
          name: 'Gyanvendra Gautam',
          nameHi: 'ज्ञानवेंद्र गौतम',
          designation: 'Program Manager',
          designationHi: 'कार्यक्रम प्रबंधक',
          bio: 'Leads skill development programs and coordinates training initiatives.',
          bioHi: 'कौशल विकास कार्यक्रमों का नेतृत्व करते हैं और प्रशिक्षण पहलों का समन्वय करते हैं।',
          order: 2,
        },
        {
          name: 'Aman Kumar',
          nameHi: 'अमन कुमार',
          designation: 'Training Coordinator',
          designationHi: 'प्रशिक्षण समन्वयक',
          bio: 'Manages vocational training programs and partner collaborations.',
          bioHi: 'व्यावसायिक प्रशिक्षण कार्यक्रमों और साझेदार सहयोगों का प्रबंधन करते हैं।',
          order: 3,
        },
      ],
    })
  }

  // Seed sample blog posts
  const blogCount = await prisma.blogPost.count()
  if (blogCount === 0) {
    await prisma.blogPost.createMany({
      data: [
        {
          title: 'Empowering Women Through Moonj Craft',
          titleHi: 'मूंज शिल्प के माध्यम से महिलाओं को सशक्त बनाना',
          slug: 'empowering-women-moonj-craft',
          excerpt: 'How traditional Moonj craft is creating sustainable livelihoods for rural women in Prayagraj.',
          excerptHi: 'मूंज शिल्प किस प्रकार प्रयागराज की ग्रामीण महिलाओं के लिए स्थायी आजीविका का सृजन कर रहा है।',
          content: 'Moonj craft, a traditional handicraft of Uttar Pradesh, has become a powerful tool for women empowerment. Through our ODOP training programs, women\'s self-help groups are learning to create beautiful baskets, bags, and decorative items from natural Moonj grass...',
          contentHi: 'मूंज शिल्प, उत्तर प्रदेश की एक पारंपरिक हस्तकला, महिला सशक्तिकरण का एक सशक्त माध्यम बन गया है। हमारे ओडीओपी प्रशिक्षण कार्यक्रमों के माध्यम से, महिला स्वयं सहायता समूह प्राकृतिक मूंज घास से सुंदर टोकरियाँ, बैग और सजावटी सामान बनाना सीख रही हैं...',
          author: 'Gyanvendra Gautam',
          authorHi: 'ज्ञानवेंद्र गौतम',
          publishedAt: new Date(),
          isPublished: true,
          category: 'Women Empowerment',
          categoryHi: 'महिला सशक्तिकरण',
          tags: 'moonj-craft,odop,women-empowerment',
          language: 'en',
        },
        {
          title: 'Vishwakarma Shram Samman Yojana: Honoring Traditional Artisans',
          titleHi: 'विश्वकर्मा श्रम सम्मान योजना: पारंपरिक कारीगरों का सम्मान',
          slug: 'vssy-honoring-artisans',
          excerpt: 'Our work under VSSY is providing skill development and recognition to traditional artisans across UP.',
          excerptHi: 'वीएसएसवाई के तहत हमारा काम उत्तर प्रदेश भर के पारंपरिक कारीगरों को कौशल विकास और मान्यता प्रदान कर रहा है।',
          content: 'The Vishwakarma Shram Samman Yojana is transforming the lives of traditional artisans including tailors, barbers, carpenters, and blacksmiths. Our organization conducts training programs that combine traditional skills with modern techniques...',
          contentHi: 'विश्वकर्मा श्रम सम्मान योजना दर्जी, नाई, बढ़ई और लोहार सहित पारंपरिक कारीगरों के जीवन को बदल रही है। हमारा संगठन ऐसे प्रशिक्षण कार्यक्रम आयोजित करता है जो पारंपरिक कौशल को आधुनिक तकनीकों के साथ जोड़ते हैं...',
          author: 'Aman Kumar',
          authorHi: 'अमन कुमार',
          publishedAt: new Date(),
          isPublished: true,
          category: 'Skill Development',
          categoryHi: 'कौशल विकास',
          tags: 'vssy,skill-development,artisans',
          language: 'en',
        },
      ],
    })
  }

  // Seed gallery images
  const galleryCount = await prisma.galleryImage.count()
  if (galleryCount === 0) {
    await prisma.galleryImage.createMany({
      data: [
        { title: 'Moonj Craft Training', titleHi: 'मूंज शिल्प प्रशिक्षण', imageUrl: '', category: 'training', categoryHi: 'प्रशिक्षण' },
        { title: 'Tailoring Program', titleHi: 'सिलाई कार्यक्रम', imageUrl: '', category: 'training', categoryHi: 'प्रशिक्षण' },
        { title: 'Community Event', titleHi: 'सामुदायिक कार्यक्रम', imageUrl: '', category: 'events', categoryHi: 'कार्यक्रम' },
        { title: 'ODOP Exhibition', titleHi: 'ओडीओपी प्रदर्शनी', imageUrl: '', category: 'events', categoryHi: 'कार्यक्रम' },
      ],
    })
  }

  console.log('Seed completed!', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())