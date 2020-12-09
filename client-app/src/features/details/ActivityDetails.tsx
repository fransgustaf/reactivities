import React from 'react'
import {Button, Card, Image} from 'semantic-ui-react'
import {IActivity} from '../../app/modules/activity'

interface IProps {
    activity: IActivity;
    setSelectedActivity: (activity: IActivity | null) => void;
    setEditMode: (editMode: boolean) => void;
}

export const ActivityDetails: React.FC<IProps> = ({activity, setSelectedActivity, setEditMode}) => {
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button onClick={() => setEditMode(true)} basic color='blue' content='edit' />
                    <Button onClick={() => setSelectedActivity(null)} basic color='grey' content='cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default ActivityDetails