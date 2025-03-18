<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Nuxdy Form Example</h1>

    <NuxdyForm :config="formConfig" @submit="handleSubmit" />
  </div>
</template>

<script setup>
const formConfig = {
  id: "contact-form",
  title: "Contact Us",
  description: "Please fill out this form to get in touch with us.",
  fields: [
    {
      id: "name",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      id: "email",
      type: "email",
      label: "Email Address",
      placeholder: "your.email@example.com",
      required: true,
      validation: {
        message: "Please enter a valid email address",
      },
    },
    {
      id: "subject",
      type: "select",
      label: "Subject",
      required: true,
      options: [
        { value: "general", label: "General Inquiry" },
        { value: "support", label: "Technical Support" },
        { value: "feedback", label: "Feedback" },
      ],
    },
    {
      id: "message",
      type: "text",
      label: "Message",
      placeholder: "Your message here...",
      required: true,
    },
    {
      id: "subscribe",
      type: "checkbox",
      label: "Subscribe to newsletter",
      defaultValue: false,
    },
  ],
  submitLabel: "Send Message",
  resetLabel: "Clear Form",
};

const handleSubmit = (data) => {
  console.log("Form submitted:", data);
  // Here you would typically send the data to your API
  alert("Form submitted successfully!");
};
</script>
