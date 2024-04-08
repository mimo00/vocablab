"use server";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { BASE_URL } from '@/app/lib/utils';

export async function createFlashcard(formData: FormData) {
    const fleshcardData= {
        front: formData.get('front'),
        back: formData.get('back')
    }
    await fetch(`${BASE_URL}/flashcards/flashcards/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fleshcardData),
    })
    revalidatePath('/flashcards');
    redirect('/flashcards');
}
