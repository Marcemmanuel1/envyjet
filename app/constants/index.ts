export const FORM_TABS = [
  { id: "oneWay", label: "ONE WAY" },
  { id: "roundTrip", label: "ROUND TRIP" },
  { id: "multiLeg", label: "MULTI-LEG" },
] as const;

export const SERVICES_DATA = [
  {
    title: "Exclusive private jet charter",
    description:
      "From your starting point to your final destination, relax with complete peace of mind.",
    image: "/images/service-private-jet.webp",
    fileUrl: "/jet-charter",
  },
  {
    title: "Shared Flights",
    description:
      "Discover the exclusive EnvyJet experience with our shared jet flights.",
    image: "/images/service-shared-flights.webp",
    fileUrl: "/shared-charter",
  },
  {
    title: "Empty Legs",
    description: "EnvyJet offers you a unique opportunity to save money.",
    image: "/images/service-empty-legs.webp",
    fileUrl: "/empty-charter",
  },
] as const;

export const FAQ_DATA = [
  {
    question:
      "How far in advance should I book a charter to guarantee availability?",
    answer:
      "The recommended time frame for booking a charter flight may vary depending on several factors, including season, destination and aircraft availability. However, to ensure availability and have the most choice in terms of aircraft and routes, we generally recommend booking your charter flight at least a few weeks in advance, especially during peak periods such as holidays. or special events. We understand that sometimes trips can be planned at the last minute. In these cases, we will do our best to accommodate your needs and find available options. Our team is here to help you every step of the way and answer any questions you may have about planning your charter.",
  },
  {
    question: "Can you arrange flights to remote or less accessible locations?",
    answer:
      "Yes, as a private jet charter specialist we have the ability to arrange flights to a wide variety of destinations, including remote or less accessible locations. Thanks to our extensive network of partners and our logistics expertise, we are able to meet your travel needs, regardless of the destination.",
  },
  {
    question:
      "How do you guarantee the privacy and confidentiality of your customers?",
    answer:
      "The privacy and confidentiality of our customers are of the utmost importance to us. We implement strict measures to ensure that all our customers' personal information and travel details remain confidential and secure. Our teams are trained to handle all information with the utmost professionalism and discretion, and we are committed to upholding the highest standards of privacy protection.",
  },
  {
    question: "Is customer support available 24/7?",
    answer:
      "Absolutely, our customer support team is available 24/7 to answer all your questions and assist you in planning your trips. Whether it's a reservation request, last minute changes or any other assistance needed, our team is here to provide you with exceptional service anytime, anywhere.",
  },
] as const;
