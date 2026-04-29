import toast from 'react-hot-toast';
import { useFormStore } from '../store/formStore';
import { formService } from '../services/formService';
import FormHeader from '../components/Form/FormHeader';
import SchoolInfoSection from '../components/Form/SchoolInfoSection';
import LabCategorySelector from '../components/Form/LabCategorySelector';
import ItemSelectionTable from '../components/Form/ItemSelectionTable';
import SummaryBar from '../components/Form/SummaryBar';
import CustomItemsSection from '../components/Form/CustomItemsSection';
import SubmittedBySection from '../components/Form/SubmittedBySection';
import FormFooter from '../components/Form/FormFooter';

export default function FormPage() {
  const store = useFormStore();

  const handleSubmit = async () => {
    // Client-side validation
    if (!store.schoolName.trim()) {
      toast.error('Please enter the School Name');
      return;
    }
    if (!store.contactPerson.trim()) {
      toast.error('Please enter the Contact Person');
      return;
    }
    if (!store.contactEmail.trim()) {
      toast.error('Please enter the Email Address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(store.contactEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (!store.submitterName.trim()) {
      toast.error('Please enter Your Name');
      return;
    }
    if (!store.selectedCategory) {
      toast.error('Please select a Lab Category');
      return;
    }

    store.setSubmitting(true);
    const loadingToast = toast.loading('Submitting your form…');

    try {
      const selectedItems = store.getSelectedItems();
      const validCustomItems = store.customItems.filter(c => c.itemName.trim());

      const payload = {
        schoolInfo: {
          schoolName: store.schoolName,
          schoolCode: store.schoolCode,
          contactPerson: store.contactPerson,
          contactEmail: store.contactEmail,
          contactPhone: store.contactPhone,
        },
        labCategory: store.selectedCategory,
        selectedItems,
        customItems: validCustomItems,
        submittedBy: {
          submitterName: store.submitterName,
          targetDate: store.targetDate,
          additionalNotes: store.additionalNotes,
        },
      };

      const result = await formService.submitForm(payload);

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success('Form submitted successfully!');
        store.setSubmitted(true);
        setTimeout(() => {
          store.resetForm();
        }, 3000);
      } else {
        toast.error(result.message || 'Submission failed');
      }
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const msg = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      store.setSubmitting(false);
    }
  };

  const handleReset = () => {
    store.resetForm();
    toast('Form has been reset', { icon: '🔄' });
  };

  return (
    <div className="page-wrapper">
      <FormHeader />

      <div className="form-card">
        <form onSubmit={(e) => e.preventDefault()} noValidate>
          <SchoolInfoSection />

          <div className="divider"></div>

          <LabCategorySelector />

          <div className="divider"></div>

          <ItemSelectionTable />

          <SummaryBar />

          <CustomItemsSection />

          {store.selectedCategory && <div className="divider"></div>}

          <SubmittedBySection />

          <FormFooter
            onSubmit={handleSubmit}
            onReset={handleReset}
            isSubmitting={store.isSubmitting}
            isSubmitted={store.isSubmitted}
          />
        </form>
      </div>
    </div>
  );
}
