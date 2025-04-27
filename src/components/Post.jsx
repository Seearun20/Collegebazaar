import React from 'react'
import '../styles/post.css'
import '../styles/style.css'

export default function Post() {
  return (
    <main className="post-page">
      <h1>Post Your Item</h1>
      <form className="post-form">
        <label>
          Item Name:
          <input type="text" name="name" required />
        </label>

        <label>
          Description:
          <textarea name="description" rows="4" required></textarea>
        </label>

        <label>
          Asking Price (₹):
          <input type="number" name="asking_price" required />
        </label>

        <label>
          Deadline to Sell:
          <input type="date" name="deadline" required />
        </label>

        <label>
          Upload Image:
          <input type="file" name="image" accept="image/*" />
        </label>

        <label>
          Upload Video:
          <input type="file" name="video" accept="video/*" />
        </label>

        <button type="submit">Post Listing</button>
      </form>
    </main>
  )
}
