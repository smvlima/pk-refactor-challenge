import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReservationEditor from '../src/components/ReservationEditor'


// NOTE: One test is intentionally failing to nudge refactors


function assertText(rx: RegExp) {
expect(screen.getByText(rx)).toBeInTheDocument()
}


test('loads and shows initial total based on API data', async () => {
render(<ReservationEditor id="abc123" />)
assertText(/loading/i)
await waitFor(() => assertText(/edit reservation/i))
// basePrice 40 * nights 2 + fees 10 = 90
assertText(/total: \$90/i)
})


test('changing nights updates total', async () => {
render(<ReservationEditor id="abc123" />)
await screen.findByText(/edit reservation/i)
const nights = screen.getByLabelText(/nights/i)
await userEvent.clear(nights)
await userEvent.type(nights, '3')
assertText(/total: \$130/i) // 40*3 + 10
})


// Intentionally failing until the error message uses role="alert"
// (Good refactor adds semantics & focus management.)


test('error messages are announced to assistive tech', async () => {
render(<ReservationEditor id="abc123" />)
await screen.findByText(/edit reservation/i)
// Cause a validation error by clearing guest name then saving
const name = screen.getByLabelText(/guest name/i)
await userEvent.clear(name)
const save = screen.getByRole('button', { name: /save/i })
await userEvent.click(save)
await waitFor(() => {
expect(screen.getByRole('alert')).toHaveTextContent(/guest name is required/i)
})
})